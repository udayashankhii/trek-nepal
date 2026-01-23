from __future__ import annotations

import secrets
import uuid

from django.db import models
from django.utils import timezone


class CustomizeTripRequest(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_REVIEW = "in_review", "In review"
        QUOTE_SENT = "quote_sent", "Quote sent"
        CONFIRMED = "confirmed", "Confirmed"
        CLOSED = "closed", "Closed"

    class DateFlexibility(models.TextChoices):
        EXACT = "exact", "Exact date"
        PLUS_3 = "plus_3", "± 3 days"
        PLUS_7 = "plus_7", "± 1 week"
        FLEXIBLE = "flexible", "Flexible / Open"

    class AccommodationLevel(models.TextChoices):
        STANDARD = "standard", "Standard teahouse"
        COMFORT = "comfort", "Comfort"
        LUXURY = "luxury", "Luxury"

    class PorterPreference(models.TextChoices):
        NONE = "none", "None"
        SHARED = "shared", "Shared porter"
        PER_PERSON = "per_person", "Porter per person"

    class FitnessLevel(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        AVERAGE = "average", "Average"
        FIT = "fit", "Fit"
        VERY_FIT = "very_fit", "Very fit"

    class ProductType(models.TextChoices):
        TREK = "trek", "Trek"
        TOUR = "tour", "Tour"
        GENERAL = "general", "General"

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    request_ref = models.CharField(max_length=32, unique=True, db_index=True)

    trip_slug = models.SlugField(max_length=128, blank=True)
    trip_name = models.CharField(max_length=256, blank=True)
    product_type = models.CharField(
        max_length=32,
        choices=ProductType.choices,
        default=ProductType.GENERAL,
    )
    product_slug = models.SlugField(max_length=128, blank=True, null=True)
    product_name = models.CharField(max_length=256, blank=True, null=True)
    preferred_region = models.CharField(max_length=64, blank=True)
    preferred_start_date = models.DateField(null=True, blank=True)
    date_flexibility = models.CharField(
        max_length=16,
        choices=DateFlexibility.choices,
        default=DateFlexibility.EXACT,
    )

    duration_days = models.PositiveSmallIntegerField(default=10)
    adults = models.PositiveSmallIntegerField(default=1)
    children = models.PositiveSmallIntegerField(default=0)
    private_trip = models.BooleanField(default=True)
    accommodation = models.CharField(
        max_length=32,
        choices=AccommodationLevel.choices,
        default=AccommodationLevel.COMFORT,
    )
    transport = models.CharField(max_length=64, blank=True)
    guide_required = models.BooleanField(default=True)
    porter_preference = models.CharField(
        max_length=16,
        choices=PorterPreference.choices,
        default=PorterPreference.SHARED,
    )

    add_ons = models.JSONField(default=list, blank=True)
    special_requests = models.TextField(blank=True)
    origin_url = models.URLField(max_length=512, blank=True)
    source = models.CharField(max_length=128, blank=True)

    contact_name = models.CharField(max_length=128)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=32)
    contact_country = models.CharField(max_length=128)
    fitness_level = models.CharField(
        max_length=16,
        choices=FitnessLevel.choices,
        blank=True,
    )
    budget = models.CharField(max_length=32, blank=True)
    consent_to_contact = models.BooleanField(default=False)

    status = models.CharField(max_length=24, choices=Status.choices, default=Status.NEW)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Customize Trip Request"
        verbose_name_plural = "Customize Trip Requests"

    def __str__(self) -> str:
        return f"{self.request_ref} → {self.trip_name or 'custom trip'}"

    def save(self, *args, **kwargs):
        if not self.request_ref:
            self.request_ref = self._generate_request_ref()
        super().save(*args, **kwargs)

    @classmethod
    def _generate_request_ref(cls) -> str:
        prefix = timezone.now().strftime("CTR%y%m")
        for _ in range(6):
            token = secrets.token_hex(3).upper()
            candidate = f"{prefix}-{token}"
            if not cls.objects.filter(request_ref=candidate).exists():
                return candidate
        return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"
