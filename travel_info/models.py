from __future__ import annotations

from django.db import models


class TravelInfoPage(models.Model):
    slug = models.SlugField(unique=True, max_length=120)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    hero_image_url = models.URLField(blank=True)

    highlights = models.JSONField(default=list, blank=True)
    sections = models.JSONField(default=list, blank=True)
    tips = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)

    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    og_image_url = models.URLField(blank=True)
    twitter_image_url = models.URLField(blank=True)

    last_reviewed = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title
