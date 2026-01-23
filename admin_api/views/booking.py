from __future__ import annotations

import django_filters
from django.db.models import Count, Q, Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from admin_api.permissions import IsStaff
from admin_api.serializers.booking import (
    BookingAdminDetailSerializer,
    BookingAdminListSerializer,
    BookingAdminUpdateSerializer,
)
from bookings.models import Booking


class BookingAdminFilter(django_filters.FilterSet):
    trek_slug = django_filters.CharFilter(field_name="trek__slug", lookup_expr="iexact")
    currency = django_filters.CharFilter(field_name="currency", lookup_expr="iexact")
    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    start_date_after = django_filters.DateFilter(field_name="start_date", lookup_expr="gte")
    start_date_before = django_filters.DateFilter(field_name="start_date", lookup_expr="lte")
    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    created_before = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")

    class Meta:
        model = Booking
        fields = [
            "status",
            "currency",
            "trek_slug",
            "start_date_after",
            "start_date_before",
            "created_after",
            "created_before",
        ]


class BookingAdminViewSet(ModelViewSet):
    queryset = Booking.objects.select_related("trek", "user", "form_details", "billing_details").prefetch_related(
        "payments"
    )
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookingAdminFilter
    search_fields = [
        "booking_ref",
        "lead_name",
        "lead_email",
        "lead_phone",
        "trek__title",
        "trek__slug",
    ]
    ordering_fields = ["created_at", "start_date", "total_amount", "status"]
    ordering = ["-created_at"]
    lookup_field = "booking_ref"
    lookup_url_kwarg = "booking_ref"

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return BookingAdminUpdateSerializer
        if self.action == "retrieve":
            return BookingAdminDetailSerializer
        return BookingAdminListSerializer

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        qs = self.filter_queryset(self.get_queryset())
        totals = qs.aggregate(
            total_count=Count("id"),
            total_revenue=Sum("total_amount"),
            paid_count=Count("id", filter=Q(status=Booking.Status.PAID)),
            pending_count=Count("id", filter=Q(status=Booking.Status.PENDING_PAYMENT)),
            cancelled_count=Count("id", filter=Q(status=Booking.Status.CANCELLED)),
            failed_count=Count("id", filter=Q(status=Booking.Status.FAILED)),
            draft_count=Count("id", filter=Q(status=Booking.Status.DRAFT)),
            paid_revenue=Sum("total_amount", filter=Q(status=Booking.Status.PAID)),
        )

        def as_string(value):
            return "0.00" if value is None else f"{value:.2f}"

        payload = {
            "total_count": totals.get("total_count", 0) or 0,
            "paid_count": totals.get("paid_count", 0) or 0,
            "pending_count": totals.get("pending_count", 0) or 0,
            "cancelled_count": totals.get("cancelled_count", 0) or 0,
            "failed_count": totals.get("failed_count", 0) or 0,
            "draft_count": totals.get("draft_count", 0) or 0,
            "total_revenue": as_string(totals.get("total_revenue")),
            "paid_revenue": as_string(totals.get("paid_revenue")),
        }
        return Response(payload)
