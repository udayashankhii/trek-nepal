from __future__ import annotations

import secrets
import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone

from TrekCard.models import BookingIntent, TrekInfo


def generate_booking_ref() -> str:
    prefix = timezone.now().strftime("ETK%y%m")
    for _ in range(5):
        token = secrets.token_hex(3).upper()
        ref = f"{prefix}-{token}"
        if not Booking.objects.filter(booking_ref=ref).exists():
            return ref
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"


class Booking(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PENDING_PAYMENT = "pending_payment", "Pending Payment"
        PAID = "paid", "Paid"
        CANCELLED = "cancelled", "Cancelled"
        FAILED = "failed", "Failed"

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    booking_ref = models.CharField(max_length=32, unique=True, db_index=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    trek = models.ForeignKey(TrekInfo, on_delete=models.PROTECT, related_name="bookings")
    booking_intent = models.OneToOneField(
        BookingIntent,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booking",
    )

    party_size = models.PositiveIntegerField(default=1)
    start_date = models.DateField()
    end_date = models.DateField()

    lead_name = models.CharField(max_length=128)
    lead_email = models.EmailField()
    lead_phone = models.CharField(max_length=32, blank=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    currency = models.CharField(max_length=8, default="USD")
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PENDING_PAYMENT)

    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_ref:
            self.booking_ref = generate_booking_ref()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.booking_ref} → {self.trek.title}"


class BookingFormDetails(models.Model):
    class ExperienceLevel(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"
        EXPERT = "expert", "Expert"

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="form_details")

    lead_title = models.CharField(max_length=16, blank=True)
    lead_first_name = models.CharField(max_length=64, blank=True)
    lead_last_name = models.CharField(max_length=64, blank=True)

    country = models.CharField(max_length=128, blank=True)
    emergency_contact = models.CharField(max_length=256, blank=True)
    dietary_requirements = models.CharField(max_length=256, blank=True)
    medical_conditions = models.CharField(max_length=256, blank=True)
    experience_level = models.CharField(
        max_length=24,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER,
    )
    guide_language = models.CharField(max_length=64, blank=True)

    special_requests = models.TextField(blank=True)
    comments = models.TextField(blank=True)

    departure_time = models.TimeField(blank=True, null=True)
    return_time = models.TimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"Details({self.booking.booking_ref})"


class BookingPayment(models.Model):
    class Status(models.TextChoices):
        REQUIRES_PAYMENT_METHOD = "requires_payment_method", "Requires payment method"
        REQUIRES_CONFIRMATION = "requires_confirmation", "Requires confirmation"
        REQUIRES_ACTION = "requires_action", "Requires action"
        PROCESSING = "processing", "Processing"
        SUCCEEDED = "succeeded", "Succeeded"
        CANCELED = "canceled", "Canceled"
        FAILED = "failed", "Failed"

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payments")
    stripe_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="USD")
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.REQUIRES_PAYMENT_METHOD)
    client_secret = models.CharField(max_length=255, blank=True)
    raw_event = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.booking.booking_ref} → {self.stripe_intent_id}"


class BookingBillingDetails(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="billing_details")

    name = models.CharField(max_length=128, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)

    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=128, blank=True)
    state = models.CharField(max_length=128, blank=True)
    postal_code = models.CharField(max_length=32, blank=True)
    country = models.CharField(max_length=128, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Billing({self.booking.booking_ref})"


def receipt_upload_path(instance, filename: str) -> str:
    return f"bookings/receipts/{instance.booking.booking_ref}.pdf"


class BookingReceipt(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="receipt")
    pdf = models.FileField(upload_to=receipt_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Receipt({self.booking.booking_ref})"
