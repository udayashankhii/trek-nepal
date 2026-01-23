import uuid

from django.db import models
from django.utils.text import slugify


def _build_unique_slug(instance, value, max_length=120):
    base_slug = slugify(value)[:max_length].strip("-")
    slug_value = base_slug or uuid.uuid4().hex[:8]
    model = instance.__class__
    counter = 2
    while model.objects.filter(slug__iexact=slug_value).exclude(pk=instance.pk).exists():
        suffix = f"-{counter}"
        trimmed = base_slug[: max_length - len(suffix)]
        slug_value = f"{trimmed.strip('-') or uuid.uuid4().hex[:6]}{suffix}"
        counter += 1
    return slug_value


class TravelStyle(models.Model):
    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    hero_image_url = models.URLField(blank=True)
    icon = models.CharField(max_length=64, blank=True)
    accent_color = models.CharField(
        max_length=9,
        blank=True,
        help_text="Hex code or CSS color token to highlight this travel style",
    )
    metadata = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Travel Style"
        verbose_name_plural = "Travel Styles"

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = _build_unique_slug(self, self.name, max_length=self._meta.get_field("slug").max_length)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class TravelStyleTour(models.Model):
    travel_style = models.ForeignKey(
        "travel_styles.TravelStyle",
        on_delete=models.CASCADE,
        related_name="travel_style_tours",
    )
    tour = models.ForeignKey(
        "tours.Tour",
        on_delete=models.CASCADE,
        related_name="travel_style_links",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["travel_style", "tour"],
                name="travelstyle_tour_unique",
            ),
        ]
        indexes = [
            models.Index(fields=["travel_style", "order"]),
            models.Index(fields=["travel_style", "is_featured", "order"]),
        ]

    def __str__(self) -> str:
        return f"{self.travel_style.name} · {self.tour.title}"
