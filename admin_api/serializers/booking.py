from __future__ import annotations

from rest_framework import serializers

from bookings.models import Booking
from bookings.serializers import (
    BookingBillingDetailsSerializer,
    BookingFormDetailsSerializer,
    BookingPaymentSerializer,
)


class BookingAdminListSerializer(serializers.ModelSerializer):
    trek_title = serializers.CharField(source="trek.title", read_only=True)
    trek_slug = serializers.CharField(source="trek.slug", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

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
            "created_at",
            "updated_at",
            "user_id",
            "user_email",
        ]
        read_only_fields = fields


class BookingAdminDetailSerializer(BookingAdminListSerializer):
    form_details = BookingFormDetailsSerializer(read_only=True)
    billing_details = BookingBillingDetailsSerializer(read_only=True)
    payments = BookingPaymentSerializer(many=True, read_only=True)

    class Meta(BookingAdminListSerializer.Meta):
        fields = BookingAdminListSerializer.Meta.fields + [
            "notes",
            "metadata",
            "booking_intent",
            "form_details",
            "billing_details",
            "payments",
        ]
        read_only_fields = fields


class BookingAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "status",
            "notes",
            "metadata",
            "start_date",
            "end_date",
            "party_size",
            "lead_name",
            "lead_email",
            "lead_phone",
        ]
