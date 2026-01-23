from __future__ import annotations

from django.db import models


class AboutPage(models.Model):
    slug = models.SlugField(unique=True, max_length=120)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    hero_image_url = models.URLField(blank=True)
    hero_badge = models.CharField(max_length=120, blank=True)

    blocks = models.JSONField(default=list, blank=True)
    team_description = models.TextField(blank=True)

    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    og_image_url = models.URLField(blank=True)
    twitter_image_url = models.URLField(blank=True)

    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title


class AboutStat(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="stats")
    value = models.CharField(max_length=64)
    label = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.value} - {self.label}"


class AboutFeature(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="features")
    title = models.CharField(max_length=255)
    text = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class AboutTeamMember(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="team_members")
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    image = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.name


class AboutDocument(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    image = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class AboutStep(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="steps")
    step = models.CharField(max_length=16)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.step} - {self.title}"


class AboutPolicySection(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="policy_sections")
    title = models.CharField(max_length=255)
    bullets = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class AboutTestimonial(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="testimonials")
    quote = models.TextField()
    author = models.CharField(max_length=120, blank=True)
    detail = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.author or self.quote[:50]


class AboutMilestone(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="milestones")
    year = models.CharField(max_length=12)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.year


class AboutCTA(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="ctas")
    heading = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    primary_label = models.CharField(max_length=120, blank=True)
    primary_url = models.CharField(max_length=255, blank=True)
    secondary_label = models.CharField(max_length=120, blank=True)
    secondary_url = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.heading
