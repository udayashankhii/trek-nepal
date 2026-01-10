from __future__ import annotations

from decimal import Decimal
from rest_framework import serializers

from TrekCard.models import BookingIntent, TrekInfo
from .models import Booking, BookingBillingDetails, BookingFormDetails, BookingPayment
from .services import calculate_booking_pricing


class BookingCreateSerializer(serializers.ModelSerializer):
    trek_slug = serializers.SlugField(write_only=True)
    booking_intent = serializers.UUIDField(required=False, allow_null=True)
    lead_title = serializers.CharField(required=False, allow_blank=True)
    lead_first_name = serializers.CharField(required=False, allow_blank=True)
    lead_last_name = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    emergency_contact = serializers.CharField(required=False, allow_blank=True)
    dietary_requirements = serializers.CharField(required=False, allow_blank=True)
    medical_conditions = serializers.CharField(required=False, allow_blank=True)
    experience_level = serializers.ChoiceField(
        choices=BookingFormDetails.ExperienceLevel.choices,
        required=False,
    )
    guide_language = serializers.CharField(required=False, allow_blank=True)
    special_requests = serializers.CharField(required=False, allow_blank=True)
    comments = serializers.CharField(required=False, allow_blank=True)
    departure_time = serializers.TimeField(required=False, allow_null=True)
    return_time = serializers.TimeField(required=False, allow_null=True)

    class Meta:
        model = Booking
        fields = [
            "trek_slug",
            "booking_intent",
            "party_size",
            "start_date",
            "end_date",
            "lead_name",
            "lead_email",
            "lead_phone",
            "lead_title",
            "lead_first_name",
            "lead_last_name",
            "country",
            "emergency_contact",
            "dietary_requirements",
            "medical_conditions",
            "experience_level",
            "guide_language",
            "special_requests",
            "comments",
            "departure_time",
            "return_time",
            "total_amount",
            "currency",
            "notes",
            "metadata",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        trek_slug = attrs.get("trek_slug")
        trek = TrekInfo.objects.filter(slug=trek_slug).select_related("booking_card").first()
        if not trek:
            raise serializers.ValidationError({"trek_slug": "Invalid trek."})
        attrs["trek"] = trek

        intent_id = attrs.get("booking_intent")
        intent = None
        if intent_id:
            intent = BookingIntent.objects.select_related("trek").filter(booking_id=intent_id).first()
            if not intent:
                raise serializers.ValidationError({"booking_intent": "Invalid booking intent."})
            if intent.trek_id != trek.id:
                raise serializers.ValidationError({"booking_intent": "Intent does not match trek."})
            if intent.is_expired() or intent.status == BookingIntent.Status.EXPIRED:
                raise serializers.ValidationError({"booking_intent": "Booking intent expired."})
            if request and not request.user.is_staff and intent.user_id and intent.user_id != request.user.id:
                raise serializers.ValidationError({"booking_intent": "Not allowed."})
            if intent.status == BookingIntent.Status.CONFIRMED:
                raise serializers.ValidationError({"booking_intent": "Booking intent already confirmed."})

        attrs["intent"] = intent

        if not attrs.get("party_size") and intent and intent.party_size:
            attrs["party_size"] = intent.party_size

        party_size = attrs.get("party_size") or 1
        if party_size < 1:
            raise serializers.ValidationError({"party_size": "Party size must be at least 1."})

        if attrs.get("start_date") and attrs.get("end_date"):
            if attrs["start_date"] > attrs["end_date"]:
                raise serializers.ValidationError({"end_date": "End date must be after start date."})

        total_amount = attrs.get("total_amount")
        pricing = calculate_booking_pricing(trek, party_size, intent=intent)
        if pricing:
            _, computed_total = pricing
            if total_amount is not None:
                client_total = Decimal(str(total_amount))
                if (client_total - computed_total).copy_abs() > Decimal("0.01"):
                    raise serializers.ValidationError({"total_amount": "Total amount mismatch."})
            attrs["total_amount"] = computed_total
        else:
            if total_amount is None:
                raise serializers.ValidationError({"total_amount": "Total amount is required."})
            if Decimal(total_amount) <= 0:
                raise serializers.ValidationError({"total_amount": "Total amount must be greater than 0."})

        lead_name = attrs.get("lead_name", "").strip()
        first_name = attrs.get("lead_first_name", "").strip()
        last_name = attrs.get("lead_last_name", "").strip()
        if not lead_name and (not first_name or not last_name):
            raise serializers.ValidationError(
                {"lead_name": "Provide lead_name or both lead_first_name and lead_last_name."}
            )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        trek = validated_data.pop("trek")
        intent = validated_data.pop("intent", None)
        validated_data.pop("trek_slug", None)
        validated_data.pop("booking_intent", None)

        detail_fields = {
            "lead_title": validated_data.pop("lead_title", ""),
            "lead_first_name": validated_data.pop("lead_first_name", ""),
            "lead_last_name": validated_data.pop("lead_last_name", ""),
            "country": validated_data.pop("country", ""),
            "emergency_contact": validated_data.pop("emergency_contact", ""),
            "dietary_requirements": validated_data.pop("dietary_requirements", ""),
            "medical_conditions": validated_data.pop("medical_conditions", ""),
            "experience_level": validated_data.pop("experience_level", BookingFormDetails.ExperienceLevel.BEGINNER),
            "guide_language": validated_data.pop("guide_language", ""),
            "special_requests": validated_data.pop("special_requests", ""),
            "comments": validated_data.pop("comments", ""),
            "departure_time": validated_data.pop("departure_time", None),
            "return_time": validated_data.pop("return_time", None),
        }

        lead_email = validated_data.get("lead_email") or getattr(user, "email", "")
        lead_phone = validated_data.get("lead_phone") or getattr(getattr(user, "profile", None), "phone_number", "")
        validated_data["lead_email"] = lead_email
        validated_data["lead_phone"] = lead_phone

        if not validated_data.get("lead_name"):
            combined_name = " ".join(
                part for part in [detail_fields.get("lead_title"), detail_fields.get("lead_first_name"), detail_fields.get("lead_last_name")]
                if part
            ).strip()
            if combined_name:
                validated_data["lead_name"] = combined_name

        booking = Booking.objects.create(
            user=user if user and user.is_authenticated else None,
            trek=trek,
            booking_intent=intent,
            **validated_data,
        )

        if any(value not in (None, "") for value in detail_fields.values()):
            BookingFormDetails.objects.update_or_create(booking=booking, defaults=detail_fields)

        if intent and intent.email is None:
            intent.email = booking.lead_email
        if intent and intent.phone is None:
            intent.phone = booking.lead_phone
        if intent:
            intent.save(update_fields=["email", "phone"])

        return booking


class BookingSerializer(serializers.ModelSerializer):
    trek_title = serializers.CharField(source="trek.title", read_only=True)
    trek_slug = serializers.CharField(source="trek.slug", read_only=True)
    form_details = serializers.SerializerMethodField()
    billing_details = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "public_id",
            "booking_ref",
            "trek_title",
            "trek_slug",
            "party_size",
            "start_date",
            "end_date",
            "lead_name",
            "lead_email",
            "lead_phone",
            "total_amount",
            "currency",
            "status",
            "notes",
            "metadata",
            "form_details",
            "billing_details",
            "created_at",
            "updated_at",
        ]

    def get_form_details(self, obj):
        details = getattr(obj, "form_details", None)
        if not details:
            return None
        return BookingFormDetailsSerializer(details).data

    def get_billing_details(self, obj):
        details = getattr(obj, "billing_details", None)
        if not details:
            return None
        return BookingBillingDetailsSerializer(details).data


class BookingFormDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingFormDetails
        fields = [
            "lead_title",
            "lead_first_name",
            "lead_last_name",
            "country",
            "emergency_contact",
            "dietary_requirements",
            "medical_conditions",
            "experience_level",
            "guide_language",
            "special_requests",
            "comments",
            "departure_time",
            "return_time",
        ]


class BookingBillingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingBillingDetails
        fields = [
            "name",
            "email",
            "phone",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
        ]



class PaymentIntentSerializer(serializers.Serializer):
    client_secret = serializers.CharField()
    stripe_intent_id = serializers.CharField()


class BookingPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingPayment
        fields = [
            "stripe_intent_id",
            "amount",
            "currency",
            "status",
            "client_secret",
            "created_at",
            "updated_at",
        ]


class BookingQuoteSerializer(serializers.Serializer):
    trek_slug = serializers.SlugField()
    party_size = serializers.IntegerField(min_value=1)
    booking_intent = serializers.UUIDField(required=False, allow_null=True)
