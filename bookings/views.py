from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils.encoding import force_str
from rest_framework import generics, permissions, response, status, views

try:
    import stripe
except Exception:  # pragma: no cover
    stripe = None  # type: ignore

from TrekCard.models import BookingIntent, TrekInfo
from .models import Booking, BookingBillingDetails, BookingPayment
from .services import calculate_booking_pricing, generate_receipt_pdf, send_booking_confirmation_email
from .serializers import (
    BookingCreateSerializer,
    BookingBillingDetailsSerializer,
    BookingQuoteSerializer,
    BookingSerializer,
    PaymentIntentSerializer,
)


class BookingCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingCreateSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        if booking.booking_intent and booking.booking_intent.status != BookingIntent.Status.CONFIRMED:
            booking.booking_intent.status = BookingIntent.Status.HELD
            booking.booking_intent.save(update_fields=["status"])
        output = BookingSerializer(booking).data
        return response.Response(output, status=status.HTTP_201_CREATED)


class BookingDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    lookup_field = "booking_ref"
    queryset = Booking.objects.select_related("trek", "user", "form_details", "billing_details")

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)


class CreatePaymentIntentAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_ref):
        booking = Booking.objects.select_related("trek").filter(booking_ref=booking_ref).first()
        if not booking:
            return response.Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_staff and booking.user_id != request.user.id:
            return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        if stripe is None:
            return response.Response({"detail": "Stripe SDK not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not settings.STRIPE_SECRET_KEY:
            return response.Response({"detail": "Stripe secret key missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        stripe.api_key = settings.STRIPE_SECRET_KEY

        if booking.status == Booking.Status.PAID:
            return response.Response({"detail": "Booking already paid."}, status=status.HTTP_400_BAD_REQUEST)
        if booking.status == Booking.Status.CANCELLED:
            return response.Response({"detail": "Booking is cancelled."}, status=status.HTTP_400_BAD_REQUEST)
        if booking.status == Booking.Status.FAILED:
            return response.Response({"detail": "Booking payment failed."}, status=status.HTTP_400_BAD_REQUEST)

        existing_payment = booking.payments.order_by("-created_at").first()
        if existing_payment and existing_payment.status in (
            "requires_payment_method",
            "requires_confirmation",
            "requires_action",
            "processing",
        ):
            payload = {
                "client_secret": existing_payment.client_secret,
                "stripe_intent_id": existing_payment.stripe_intent_id,
            }
            return response.Response(PaymentIntentSerializer(payload).data, status=status.HTTP_200_OK)

        amount_cents = int((booking.total_amount * Decimal("100")).quantize(Decimal("1")))
        currency = (booking.currency or "USD").lower()

        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                receipt_email=booking.lead_email,
                metadata={
                    "booking_ref": booking.booking_ref,
                    "trek": booking.trek.slug,
                },
                idempotency_key=f"{booking.booking_ref}-intent",
            )
        except Exception as exc:
            return response.Response({"detail": force_str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        BookingPayment.objects.update_or_create(
            booking=booking,
            stripe_intent_id=intent.id,
            defaults={
                "amount": booking.total_amount,
                "currency": booking.currency,
                "status": intent.status,
                "client_secret": intent.client_secret or "",
            },
        )

        booking.status = Booking.Status.PENDING_PAYMENT
        booking.save(update_fields=["status", "updated_at"])

        payload = {"client_secret": intent.client_secret, "stripe_intent_id": intent.id}
        return response.Response(PaymentIntentSerializer(payload).data, status=status.HTTP_201_CREATED)


class BookingBillingDetailsAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_ref):
        booking = Booking.objects.filter(booking_ref=booking_ref).first()
        if not booking:
            return response.Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_staff and booking.user_id != request.user.id:
            return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        serializer = BookingBillingDetailsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        details, _ = BookingBillingDetails.objects.update_or_create(
            booking=booking,
            defaults=serializer.validated_data,
        )
        return response.Response(BookingBillingDetailsSerializer(details).data, status=status.HTTP_200_OK)


class StripeWebhookAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if stripe is None:
            return response.Response({"detail": "Stripe SDK not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        secret = settings.STRIPE_WEBHOOK_SECRET
        if not secret:
            return response.Response({"detail": "Stripe webhook secret missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, secret)
        except Exception as exc:
            return response.Response({"detail": force_str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        data = event.get("data", {}).get("object", {})
        intent_id = data.get("id")

        if not intent_id:
            return response.Response({"detail": "Missing intent id."}, status=status.HTTP_400_BAD_REQUEST)

        payment = BookingPayment.objects.filter(stripe_intent_id=intent_id).select_related("booking").first()
        if not payment:
            return response.Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)

        payment.status = data.get("status", payment.status)
        payment.raw_event = data
        payment.save(update_fields=["status", "raw_event", "updated_at"])

        booking = payment.booking
        previous_status = booking.status
        if payment.status == "succeeded":
            booking.status = Booking.Status.PAID
        elif payment.status in ("canceled", "failed"):
            booking.status = Booking.Status.FAILED
        else:
            booking.status = Booking.Status.PENDING_PAYMENT
        booking.save(update_fields=["status", "updated_at"])

        if previous_status != Booking.Status.PAID and booking.status == Booking.Status.PAID:
            if booking.booking_intent and booking.booking_intent.status != BookingIntent.Status.CONFIRMED:
                booking.booking_intent.status = BookingIntent.Status.CONFIRMED
                booking.booking_intent.save(update_fields=["status"])
            generate_receipt_pdf(booking)
            send_booking_confirmation_email(booking)
        elif booking.status == Booking.Status.FAILED and booking.booking_intent:
            if booking.booking_intent.status != BookingIntent.Status.CONFIRMED:
                booking.booking_intent.status = BookingIntent.Status.EXPIRED
                booking.booking_intent.save(update_fields=["status"])

        return response.Response({"ok": True}, status=status.HTTP_200_OK)


class DevMarkPaidAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_ref):
        if not settings.DEBUG:
            return response.Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        booking = Booking.objects.select_related("booking_intent", "trek").filter(booking_ref=booking_ref).first()
        if not booking:
            return response.Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_staff and booking.user_id != request.user.id:
            return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        booking.status = Booking.Status.PAID
        booking.save(update_fields=["status", "updated_at"])

        if booking.booking_intent and booking.booking_intent.status != BookingIntent.Status.CONFIRMED:
            booking.booking_intent.status = BookingIntent.Status.CONFIRMED
            booking.booking_intent.save(update_fields=["status"])

        generate_receipt_pdf(booking)
        send_booking_confirmation_email(booking)

        return response.Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)


class BookingQuoteAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = BookingQuoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trek_slug = serializer.validated_data["trek_slug"]
        party_size = serializer.validated_data["party_size"]
        intent_id = serializer.validated_data.get("booking_intent")

        trek = (
            TrekInfo.objects.select_related("booking_card")
            .prefetch_related("booking_card__group_prices")
            .filter(slug=trek_slug)
            .first()
        )
        if not trek:
            return response.Response({"detail": "Trek not found."}, status=status.HTTP_404_NOT_FOUND)

        intent = None
        if intent_id:
            intent = BookingIntent.objects.select_related("trek").filter(booking_id=intent_id).first()
            if not intent:
                return response.Response({"detail": "Booking intent not found."}, status=status.HTTP_404_NOT_FOUND)
            if intent.trek_id != trek.id:
                return response.Response({"detail": "Intent does not match trek."}, status=status.HTTP_400_BAD_REQUEST)
            if intent.is_expired() or intent.status == BookingIntent.Status.EXPIRED:
                return response.Response({"detail": "Booking intent expired."}, status=status.HTTP_400_BAD_REQUEST)
            if not request.user.is_staff and intent.user_id and intent.user_id != request.user.id:
                return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        pricing = calculate_booking_pricing(trek, party_size, intent=intent)
        if not pricing:
            return response.Response({"detail": "Pricing unavailable."}, status=status.HTTP_400_BAD_REQUEST)

        unit_price, total = pricing
        payload = {
            "trek_slug": trek.slug,
            "party_size": party_size,
            "currency": "USD",
            "unit_price": str(unit_price),
            "total_amount": str(total),
        }
        return response.Response(payload, status=status.HTTP_200_OK)
