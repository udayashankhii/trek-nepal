from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_api.permissions import IsStaff
from bookings.models import Booking
from TrekCard.models import TrekInfo


def _percent_change(current: Decimal | float | int, previous: Decimal | float | int) -> float:
    current_value = Decimal(current or 0)
    previous_value = Decimal(previous or 0)
    if previous_value == 0:
        if current_value == 0:
            return 0.0
        return 100.0
    delta = current_value - previous_value
    return float((delta / previous_value * Decimal("100")).quantize(Decimal("0.1")))


def _format_change(value: float) -> str:
    sign = "+" if value >= 0 else "-"
    return f"{sign}{abs(value):.1f}%"


def _format_amount(value: Decimal | None) -> str:
    normalized = value or Decimal("0")
    return f"{normalized:,.2f}"


class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        now = timezone.now()
        window = now - timedelta(days=30)
        prev_window = window - timedelta(days=30)

        total_treks = TrekInfo.objects.count()
        new_treks_current = TrekInfo.objects.filter(created_at__gte=window).count()
        new_treks_prev = TrekInfo.objects.filter(created_at__gte=prev_window, created_at__lt=window).count()
        trek_delta = _percent_change(new_treks_current, new_treks_prev)

        active_statuses = [Booking.Status.PAID, Booking.Status.PENDING_PAYMENT]
        active_bookings_total = Booking.objects.filter(status__in=active_statuses).count()
        active_current = Booking.objects.filter(created_at__gte=window, status__in=active_statuses).count()
        active_prev = Booking.objects.filter(created_at__gte=prev_window, created_at__lt=window, status__in=active_statuses).count()
        active_delta = _percent_change(active_current, active_prev)

        User = get_user_model()
        total_users = User.objects.filter(is_active=True).count()
        new_users_current = User.objects.filter(date_joined__gte=window).count()
        new_users_prev = User.objects.filter(date_joined__gte=prev_window, date_joined__lt=window).count()
        user_delta = _percent_change(new_users_current, new_users_prev)

        paid_bookings_current = Booking.objects.filter(status=Booking.Status.PAID, created_at__gte=window)
        paid_bookings_prev = Booking.objects.filter(status=Booking.Status.PAID, created_at__gte=prev_window, created_at__lt=window)

        revenue_current = paid_bookings_current.aggregate(total=Sum("total_amount"))["total"] or Decimal("0")
        revenue_prev = paid_bookings_prev.aggregate(total=Sum("total_amount"))["total"] or Decimal("0")
        revenue_delta = _percent_change(revenue_current, revenue_prev)

        currency_breakdown = (
            paid_bookings_current.values("currency")
            .annotate(amount=Sum("total_amount"))
            .order_by("-amount")
        )
        currency_summary = [
            {"currency": entry["currency"], "amount": _format_amount(entry["amount"])}
            for entry in currency_breakdown
        ]

        primary_currency = currency_summary[0]["currency"] if currency_summary else "USD"
        primary_amount = currency_summary[0]["amount"] if currency_summary else _format_amount(Decimal("0"))

        status_breakdown_qs = (
            Booking.objects.values("status").annotate(count=Count("id")).order_by("-count")
        )
        status_breakdown = []
        for entry in status_breakdown_qs:
            status_code = entry["status"]
            try:
                label = Booking.Status(status_code).label
            except ValueError:
                label = status_code.replace("_", " ").title()
            status_breakdown.append(
                {"status": status_code, "label": label, "count": entry["count"]}
            )

        top_treks = (
            Booking.objects.values("trek__slug", "trek__title")
            .annotate(bookings=Count("id"))
            .order_by("-bookings")[:3]
        )
        top_trek_data = [
            {"slug": trek["trek__slug"], "title": trek["trek__title"], "bookings": trek["bookings"]}
            for trek in top_treks
        ]

        recent_activity = []
        for booking in Booking.objects.select_related("trek").order_by("-created_at")[:6]:
            actor = booking.lead_name or booking.lead_email or "Guest"
            trek_title = booking.trek.title if booking.trek else booking.trek_slug
            subtitle = f"{actor} · {booking.party_size} {'person' if booking.party_size == 1 else 'people'}"
            recent_activity.append(
                {
                    "id": f"booking-{booking.booking_ref}",
                    "type": "booking",
                    "title": f"New booking · {trek_title}",
                    "subtitle": subtitle,
                    "meta": booking.booking_ref,
                    "status": booking.status,
                    "amount": _format_amount(booking.total_amount),
                    "timestamp": booking.created_at,
                }
            )

        for trek in TrekInfo.objects.order_by("-created_at")[:3]:
            recent_activity.append(
                {
                    "id": f"trek-{trek.slug}",
                    "type": "trek",
                    "title": f"Trek added · {trek.title}",
                    "subtitle": f"Region: {trek.region.name if trek.region else 'Unassigned'}",
                    "meta": trek.slug,
                    "timestamp": trek.created_at,
                }
            )

        for user in User.objects.order_by("-date_joined")[:3]:
            recent_activity.append(
                {
                    "id": f"user-{user.id}",
                    "type": "user",
                    "title": f"Member joined · {user.get_full_name() or user.username}",
                    "subtitle": user.email,
                    "meta": user.id,
                    "timestamp": user.date_joined,
                }
            )

        recent_activity.sort(key=lambda item: item["timestamp"], reverse=True)
        recent_activity = [
            {**item, "timestamp": timezone.localtime(item["timestamp"]).isoformat()}
            for item in recent_activity[:6]
        ]

        summary_cards = [
            {
                "key": "treks",
                "label": "Total Treks",
                "value": str(total_treks),
                "change": _format_change(trek_delta),
                "trend": "up" if trek_delta >= 0 else "down",
                "detail": f"{new_treks_current} new in last 30d",
                "icon": "trek",
            },
            {
                "key": "bookings",
                "label": "Active Bookings",
                "value": str(active_bookings_total),
                "change": _format_change(active_delta),
                "trend": "up" if active_delta >= 0 else "down",
                "detail": f"{active_current} active in last 30d",
                "icon": "booking",
            },
            {
                "key": "users",
                "label": "Total Users",
                "value": str(total_users),
                "change": _format_change(user_delta),
                "trend": "up" if user_delta >= 0 else "down",
                "detail": f"{new_users_current} new members",
                "icon": "users",
            },
            {
                "key": "revenue",
                "label": "Revenue (30d)",
                "value": f"{primary_currency} {primary_amount}",
                "change": _format_change(revenue_delta),
                "trend": "up" if revenue_delta >= 0 else "down",
                "detail": f"{primary_currency} {primary_amount} earned",
                "icon": "revenue",
            },
        ]

        payload = {
            "summary_cards": summary_cards,
            "revenue_summary": {
                "total": _format_amount(revenue_current),
                "currency": primary_currency,
                "breakdown": currency_summary,
            },
            "bookings_breakdown": status_breakdown,
            "top_treks": top_trek_data,
            "recent_activity": recent_activity,
        }
        return Response(payload)
