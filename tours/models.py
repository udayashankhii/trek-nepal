from __future__ import annotations

import uuid

from django.db import models
from django.utils.text import slugify

from travel_styles.models import TravelStyle


def unique_slugify(instance, value: str, slug_field_name: str = "slug", max_length: int = 80) -> str:
    base_slug = slugify(value)[:max_length].strip("-")
    slug = base_slug or str(uuid.uuid4())[:8]
    model = instance.__class__
    i = 2
    while model.objects.filter(**{f"{slug_field_name}__iexact": slug}).exclude(pk=instance.pk).exists():
        suffix = f"-{i}"
        slug = (base_slug[: max_length - len(suffix)] + suffix).strip("-")
        i += 1
    return slug


class Tour(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=120)
    location = models.CharField(max_length=120, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    short_description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)

    duration = models.CharField(max_length=50, blank=True)
    group_size = models.PositiveIntegerField(null=True, blank=True)
    difficulty = models.CharField(max_length=80, blank=True)
    start_point = models.CharField(max_length=120, blank=True)
    max_altitude = models.CharField(max_length=50, blank=True)
    activity = models.CharField(max_length=120, blank=True)
    travel_style = models.CharField(max_length=80, blank=True)
    badge = models.CharField(max_length=80, blank=True)
    primary_style = models.ForeignKey(
        TravelStyle,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="primary_tours",
    )
    travel_styles = models.ManyToManyField(
        TravelStyle,
        blank=True,
        related_name="tours",
        through="travel_styles.TravelStyleTour",
    )

    rating = models.FloatField(default=0.0, blank=True)
    reviews_count = models.PositiveIntegerField(default=0, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    tags = models.JSONField(default=list, blank=True)
    categories = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = unique_slugify(self, self.title, "slug", max_length=120)
        super().save(*args, **kwargs)


class TourOverview(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, related_name="overview")
    heading = models.CharField(max_length=255, blank=True)
    paragraphs = models.JSONField(default=list, blank=True)
    points = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return f"Overview · {self.tour.title}"


class TourItineraryDay(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="itinerary_days")
    day = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=50, blank=True)
    distance = models.CharField(max_length=50, blank=True)
    meals = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["day"]
        unique_together = ("tour", "day")

    def __str__(self) -> str:
        return f"{self.tour.title} · Day {self.day}: {self.title}"


class TourHighlight(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="highlight_items")
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.text


class TourCost(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, related_name="cost")
    inclusions = models.JSONField(default=list, blank=True)
    exclusions = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return f"Cost · {self.tour.title}"


class TourAdditionalInfoSection(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="additional_info_sections")
    heading = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    articles = models.JSONField(default=list, blank=True)
    bullets = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.heading or 'Info'} · {self.tour.title}"


class TourGroupPrice(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="group_prices")
    label = models.CharField(max_length=120, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    min_size = models.PositiveIntegerField(null=True, blank=True)
    max_size = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.label or 'Group'} · {self.tour.title}"


class TourGalleryImage(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="gallery_images")
    image_url = models.URLField()
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"Gallery · {self.tour.title}"


class TourSEO(models.Model):
    tour = models.OneToOneField(Tour, on_delete=models.CASCADE, related_name="seo")
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    canonical_url = models.URLField(blank=True)
    focus_keyword = models.CharField(max_length=120, blank=True)

    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    og_image_url = models.URLField(blank=True)

    twitter_title = models.CharField(max_length=255, blank=True)
    twitter_description = models.TextField(blank=True)
    twitter_image_url = models.URLField(blank=True)

    robots_noindex = models.BooleanField(default=False)
    robots_nofollow = models.BooleanField(default=False)
    breadcrumbs = models.JSONField(default=list, blank=True)
    structured_data = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return f"SEO · {self.tour.title}"


class TourInternalLink(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="internal_links")
    label = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    section = models.CharField(max_length=120, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.label} · {self.tour.title}"


class TourBacklink(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="backlinks")
    source_name = models.CharField(max_length=255, blank=True)
    url = models.URLField()
    anchor_text = models.CharField(max_length=255, blank=True)
    rel = models.CharField(max_length=50, blank=True)
    discovered_at = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"Backlink · {self.tour.title}"


class SimilarTour(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="similar_tours")
    related_tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="similar_to")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        unique_together = ("tour", "related_tour")

    def __str__(self) -> str:
        return f"Similar · {self.tour.title} -> {self.related_tour.title}"


class TourReview(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="reviews")
    author_name = models.CharField(max_length=120)
    rating = models.PositiveIntegerField(default=5)
    title = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    source_name = models.CharField(max_length=120, blank=True)
    source_url = models.URLField(blank=True)
    published_at = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Review · {self.tour.title} · {self.author_name}"
