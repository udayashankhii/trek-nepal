# TrekCard/models.py
from __future__ import annotations

import uuid
from datetime import timedelta
from typing import Optional

from django.conf import settings
from django.db import models
from django.db.models import Avg, Count
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.text import slugify


# -------------------------------------------------------
# Utilities
# -------------------------------------------------------

def unique_slugify(instance, value: str, slug_field_name: str = "slug", max_length: int = 60) -> str:
    """
    Create a unique slug from `value` and assign to the given slug field on `instance`.
    """
    base_slug = slugify(value)[:max_length].strip("-")
    slug = base_slug or str(uuid.uuid4())[:8]
    Model = instance.__class__
    i = 2
    while Model.objects.filter(**{f"{slug_field_name}__iexact": slug}).exclude(pk=instance.pk).exists():
        suffix = f"-{i}"
        slug = (base_slug[: max_length - len(suffix)] + suffix).strip("-")
        i += 1
    return slug


def default_booking_expiry():
    """Migration-safe callable (no lambdas) used as default for BookingIntent.expires_at."""
    return timezone.now() + timedelta(hours=2)


# -------------------------------------------------------
# Core Trek Models
# -------------------------------------------------------

class Region(models.Model):
    """
    A first-class region for treks (Everest, Annapurna, Langtang, Manaslu, Mustang…).
    This powers the navbar, region pages, and server-side filtering.
    """
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    short_label = models.CharField(
        max_length=40, blank=True,
        help_text="Optional short tag line, e.g. 'EBC, Gokyo, Three Passes'"
    )
    order = models.PositiveIntegerField(default=0, help_text="Sort order in menus/lists")

    # For the 'floating marker' position over a Nepal map image in your mega-menu (percent values 0..100)
    marker_x = models.PositiveIntegerField(default=50, help_text="Marker % from the left (0–100)")
    marker_y = models.PositiveIntegerField(default=50, help_text="Marker % from the top (0–100)")

    # Optional cover image for region listing pages/mega-menu
    cover = models.ImageField(upload_to="region_covers/", blank=True, null=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name




class TrekInfo(models.Model):
    # Public-safe identifier (avoid exposing incremental ints)
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)

    # NEW: link each trek to a Region
    region = models.ForeignKey(
        Region,
        on_delete=models.PROTECT,
        related_name="treks",
        null=True, blank=True,         # ← keep nullable for the first migration; you can enforce later
        help_text="Select the region this trek belongs to",
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    duration = models.CharField(max_length=50)
    trip_grade = models.CharField(max_length=50)
    start_point = models.CharField(max_length=100)
    group_size = models.CharField(max_length=50)
    max_altitude = models.CharField(max_length=50)
    activity = models.CharField(max_length=100)
    rating = models.FloatField(default=0.0, blank=True)
    reviews = models.PositiveIntegerField(default=0, blank=True)
    review_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Trek"
        verbose_name_plural = "Treks"

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = unique_slugify(self, self.title, "slug", max_length=60)
        super().save(*args, **kwargs)


# -----------------------------
# Overview (sections + bullets)
# -----------------------------

class TrekOverview(models.Model):
    trek = models.OneToOneField(
        TrekInfo, on_delete=models.CASCADE, related_name="overview",
        help_text="The trek this overview belongs to",
    )

    class Meta:
        verbose_name = "Trek Overview"
        verbose_name_plural = "Trek Overviews"

    def __str__(self) -> str:
        return f"Overview · {self.trek.title}"


class TrekOverviewSection(models.Model):
    overview = models.ForeignKey(TrekOverview, on_delete=models.CASCADE, related_name="sections")
    heading = models.CharField(max_length=255, blank=True, null=True)
    articles = models.JSONField(default=list, help_text="List of paragraph strings")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.heading or 'Section'} · {self.overview.trek.title}"


class TrekOverviewBullet(models.Model):
    section = models.ForeignKey(TrekOverviewSection, on_delete=models.CASCADE, related_name="bullets")
    text = models.CharField(max_length=512)
    icon = models.CharField(max_length=64, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"• {self.text[:40]}"


# -----------------------------
# Itinerary / Highlights
# -----------------------------

class TrekItineraryDay(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="itinerary_days")
    day = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    accommodation = models.CharField(max_length=255, blank=True, null=True)
    altitude = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)
    distance = models.CharField(max_length=50, blank=True, null=True)
    meals = models.CharField(max_length=255, blank=True, null=True)

    # ✅ ADD THESE (Google Map point for this day)
    place_name = models.CharField(max_length=150, blank=True, default="")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        ordering = ["day"]
        unique_together = ("trek", "day")

    def __str__(self) -> str:
        return f"{self.trek.title} · Day {self.day}: {self.title}"


class TrekHighlight(models.Model):
    class Icons(models.TextChoices):
        CULTURE = "culture", "Culture"
        SCENERY = "scenery", "Scenery"
        ACHIEVEMENT = "achievement", "Achievement"
        PHOTOGRAPHY = "photography", "Photography"
        COMMUNITY = "community", "Community"
        HEALTH = "health", "Health"

    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="highlights")
    title = models.CharField(max_length=150)
    description = models.TextField()
    icon = models.CharField(max_length=20, choices=Icons.choices)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.title} · {self.get_icon_display()}"


# -----------------------------
# Actions (PDF / Map)
# -----------------------------

class TrekAction(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="action", null=True, blank=True)
    pdf = models.FileField(upload_to="trek_pdfs/", blank=True, null=True)
    map_image = models.ImageField(upload_to="trek_maps/", blank=True, null=True)

    def __str__(self) -> str:
        return f"Action · {self.trek.title}" if self.trek else "Action (Unlinked)"


# -----------------------------
# Cost & Dates (departures)
# -----------------------------

class Cost(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="cost", null=True, blank=True)
    title = models.CharField(max_length=255)
    cost_inclusions = models.JSONField(default=list, blank=True)
    cost_exclusions = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return self.title


class TrekDeparture(models.Model):
    class Status(models.TextChoices):
        GUARANTEED = "Guaranteed", "Guaranteed"
        AVAILABLE = "Available", "Available"
        SOLD_OUT = "Sold Out", "Sold Out"
        LIMITED = "Limited", "Limited"

    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="departures")
    start = models.DateField()
    end = models.DateField()
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.GUARANTEED)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    seats_left = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["start"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.start} → {self.end} · {self.status}"


class TrekGroupPrice(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="group_prices")
    label = models.CharField(max_length=64)  # e.g., '1 Person', '2–4 Person'
    price = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        ordering = ["price"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.label}: {self.price}"


class TrekDateHighlight(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="date_highlights")
    highlight = models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.highlight}"


class TrekCostAndDateSection(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="cost_and_date_section")
    intro_text = models.TextField(
        default="Start Dates refer to your arrival date in Nepal. End Dates correspond to your return date from Nepal."
    )

    def __str__(self) -> str:
        return f"Cost & Dates · {self.trek.title}"


# -----------------------------
# FAQ / Gallery / Hero
# -----------------------------

class TrekFAQCategory(models.Model):
    class Icons(models.TextChoices):
        GENERAL = "general", "General Information"
        PRACTICAL = "practical", "Accommodation & Meals"
        BOOKING = "booking", "Booking"
        FINANCIAL = "financial", "Financial"
        ELIGIBILITY = "eligibility", "Eligibility"
        HEALTH = "health", "Safety & Health"
        GEAR = "gear", "Equipment & Gear"

    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="faq_categories")
    title = models.CharField(max_length=128)
    icon = models.CharField(max_length=32, choices=Icons.choices, default=Icons.GENERAL)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.title}"


class TrekFAQ(models.Model):
    category = models.ForeignKey(TrekFAQCategory, on_delete=models.CASCADE, related_name="questions")
    question = models.CharField(max_length=512)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"Q: {self.question[:40]}"


class TrekGalleryImage(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="trek_gallery/")
    title = models.CharField(max_length=128, blank=True)
    caption = models.CharField(max_length=256, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.title or self.image.name}"


class TrekHeroSection(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="hero_section")
    title = models.CharField(max_length=255, blank=True, help_text="Main title")
    subtitle = models.CharField(max_length=512, blank=True, help_text="Subtitle/tagline")
    image = models.ImageField(upload_to="hero_images/", blank=True, null=True)
    season = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    difficulty = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    cta_label = models.CharField(max_length=100, default="Book This Trek")
    cta_link = models.CharField(max_length=256, blank=True)

    class Meta:
        verbose_name = "Trek Hero Section"
        verbose_name_plural = "Trek Hero Sections"

    def __str__(self) -> str:
        return f"Hero · {self.trek.title}"


# -----------------------------
# Elevation Chart
# -----------------------------

class TrekElevationChart(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="elevation_chart")
    title = models.CharField(max_length=128, default="Elevation Chart")
    subtitle = models.CharField(max_length=255, blank=True, default="")
    background_image = models.ImageField(upload_to="elevation_chart/", blank=True, null=True)

    def __str__(self) -> str:
        return f"Elevation Chart · {self.trek.title}"


class TrekElevationPoint(models.Model):
    chart = models.ForeignKey(TrekElevationChart, on_delete=models.CASCADE, related_name="points")
    day = models.PositiveIntegerField(help_text="Day number")
    title = models.CharField(max_length=128)
    elevation = models.PositiveIntegerField(help_text="Meters")
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "day"]

    def __str__(self) -> str:
        return f"Day {self.day}: {self.title} ({self.elevation}m)"


# -----------------------------
# Booking Card + Group Prices
# -----------------------------

class PricingDisplayMode(models.TextChoices):
    BASE_ONLY = "base_only", "Only Base Price"
    ORIGINAL_AND_SAVE = "original_and_save", "Show Original Price with Saving %"
    ORIGINAL_ONLY = "original_only", "Show Only Original Price"


class TrekBookingCard(models.Model):
    trek = models.OneToOneField(TrekInfo, on_delete=models.CASCADE, related_name="booking_card")
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pricing_mode = models.CharField(max_length=20, choices=PricingDisplayMode.choices, default=PricingDisplayMode.BASE_ONLY)
    badge_label = models.CharField(max_length=100, blank=True, null=True)

    secure_payment = models.BooleanField(default=False)
    no_hidden_fees = models.BooleanField(default=False)
    free_cancellation = models.BooleanField(default=False)
    support_24_7 = models.BooleanField(default=False)
    trusted_reviews = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Booking Card · {self.trek.title}"


class TrekBookingGroupPrice(models.Model):
    booking = models.ForeignKey(TrekBookingCard, on_delete=models.CASCADE, related_name="group_prices")
    min_size = models.PositiveIntegerField(null=True, blank=True, help_text="Minimum group size")
    max_size = models.PositiveIntegerField(null=True, blank=True, help_text="Maximum group size")
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["min_size"]

    def __str__(self) -> str:
        if self.min_size and self.max_size and self.min_size == self.max_size:
            return f"{self.min_size} Person: ${self.price}"
        if self.min_size and self.max_size:
            return f"{self.min_size}-{self.max_size} Person: ${self.price}"
        return f"Group Price: ${self.price}"


# -----------------------------
# Additional Info (articles + bullets)
# -----------------------------

class TrekAdditionalInfoSection(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="additional_info_sections")
    heading = models.CharField(max_length=255, blank=True, null=True)
    articles = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.heading or 'Section'}"


class TrekAdditionalInfoBullet(models.Model):
    section = models.ForeignKey(TrekAdditionalInfoSection, on_delete=models.CASCADE, related_name="bullets")
    text = models.CharField(max_length=512)
    icon = models.CharField(max_length=64, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"• {self.text[:30]}"


# -----------------------------
# Booking Intent (UUID, lightweight)
# -----------------------------

class BookingIntent(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        HELD = "held", "Held (awaiting payment)"
        EXPIRED = "expired", "Expired"
        CONFIRMED = "confirmed", "Confirmed"

    booking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="booking_intents")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booking_intents",
    )
    departure = models.ForeignKey("TrekDeparture", on_delete=models.SET_NULL, null=True, blank=True)
    party_size = models.PositiveIntegerField(default=1)

    price_snapshot = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_booking_expiry)

    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.booking_id} → {self.trek.title}"

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at


# -----------------------------
# Similar Treks (manual curation)
# -----------------------------

class SimilarTrek(models.Model):
    trek = models.ForeignKey(
        TrekInfo, on_delete=models.CASCADE, related_name="similar_treks",
        help_text="The trek for which similar treks are suggested.",
    )
    related_trek = models.ForeignKey(
        TrekInfo, on_delete=models.CASCADE, related_name="related_to",
        help_text="A trek that is similar or recommended.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        unique_together = ("trek", "related_trek")

    def __str__(self) -> str:
        return f"{self.trek.title} → {self.related_trek.title}"


# -----------------------------
# Reviews
# -----------------------------

class ReviewSource(models.TextChoices):
    INTERNAL = "internal", "Internal"
    TRIPADVISOR = "tripadvisor", "TripAdvisor"
    GOOGLE = "google", "Google"
    OTHER = "other", "Other"


class TrekReview(models.Model):
    trek = models.ForeignKey(TrekInfo, on_delete=models.CASCADE, related_name="reviews_list")
    reviewer_name = models.CharField(max_length=128)
    reviewer_country = models.CharField(max_length=64, blank=True)
    reviewer_avatar = models.ImageField(upload_to="review_avatars/", blank=True, null=True)

    rating = models.PositiveSmallIntegerField(default=5, help_text="1–5 stars")
    title = models.CharField(max_length=200, blank=True)
    body = models.TextField()

    source = models.CharField(max_length=24, choices=ReviewSource.choices, default=ReviewSource.INTERNAL)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.trek.title} · {self.reviewer_name} ({self.rating})"


# -------------------------------------------------------
# Signals: keep TrekInfo.rating / reviews in sync
# -------------------------------------------------------

@receiver([post_save, post_delete], sender=TrekReview)
def sync_trek_rating(sender, instance: TrekReview, **kwargs):
    trek = instance.trek
    agg = trek.reviews_list.filter(is_published=True).aggregate(avg=Avg("rating"), cnt=Count("id"))
    trek.rating = float(agg["avg"] or 0.0)
    trek.reviews = int(agg["cnt"] or 0)
    trek.save(update_fields=["rating", "reviews"])
