# blog/models.py
from __future__ import annotations

from django.conf import settings
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
    RegexValidator,
)
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


# -----------------------------
# Helpers (JSONField defaults)
# -----------------------------
def default_featured_image() -> dict:
    return {"url": "", "alt": "", "caption": ""}


def default_images() -> list:
    # list of {url, alt, caption}
    return []


def default_taxonomies() -> dict:
    return {
        "focusKeyword": "",
        "tags": [],
        "keywords": [],
    }


def default_content_settings() -> dict:
    return {
        "tocEnabled": True,
        "tocMode": "auto",  # auto | off | manual
        "tocIncludeLevels": [2, 3],
        "tocTitle": "Table of Contents",
        "vlogEnabled": False,
        "shareEnabled": True,
    }


def default_toc() -> list:
    # list of {id, title, level}
    return []


def default_content() -> dict:
    # Rich editor blocks (flexible): heading, paragraph, image, list, table, faq, callout, quote, cta_block, etc.
    return {
        "format": "rich_blocks_v1",
        "vlog": None,  # or dict with youtube info
        "blocks": [],
    }


def default_cta() -> dict:
    return {
        "primary": {"label": "", "href": ""},
        "secondary": {"label": "", "href": ""},
    }


def default_links() -> dict:
    return {
        "internalLinks": [],  # list of {text, href}
        "backlinks": [],  # list of {url, anchorText, rel, type, notes}
    }


def default_related_posts() -> list:
    # list of {slug, title}
    return []


def default_social() -> dict:
    return {
        "share": {
            "enabled": True,
            "shareUrl": "",
            "shareTitle": "",
            "shareText": "",
            "hashtags": [],
            "utm": {"source": "social", "medium": "share", "campaign": ""},
        }
    }


def default_seo() -> dict:
    return {
        "focusKeyword": "",
        "keywords": [],
        "robots": {
            "index": True,
            "follow": True,
            "maxSnippet": -1,
            "maxImagePreview": "large",
            "maxVideoPreview": -1,
        },
        "openGraph": {
            "type": "article",
            "title": "",
            "description": "",
            "url": "",
            "image": {"url": "", "alt": ""},
            "siteName": "",
        },
        "twitter": {
            "card": "summary_large_image",
            "title": "",
            "description": "",
            "image": "",
        },
        "hreflang": [],
    }


def default_schema() -> dict:
    # Store the full JSON-LD graph for maximum flexibility.
    return {"@context": "https://schema.org", "@graph": []}


def default_editorial() -> dict:
    return {
        "qualityChecklist": {
            "hasFocusKeywordInTitle": False,
            "hasMetaTitle": False,
            "hasMetaDescription": False,
            "hasCanonicalUrl": False,
            "hasOpenGraph": False,
            "hasTwitterCard": False,
            "hasFAQSchema": False,
            "hasBreadcrumbSchema": False,
            "hasInternalLinks": False,
            "hasExternalBacklinks": False,
            "imagesHaveAltText": False,
            "hasCTA": False,
        }
    }


# -----------------------------
# Base mixin
# -----------------------------
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# -----------------------------
# Taxonomy models
# -----------------------------
slug_validator = RegexValidator(
    regex=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    message="Slug must be lowercase letters/numbers with hyphens (e.g. 'langtang-valley-trek').",
)


class Category(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, validators=[slug_validator])
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_active", "order"]),
        ]

    def __str__(self) -> str:
        return self.name


class Region(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, validators=[slug_validator])
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_active", "order"]),
        ]

    def __str__(self) -> str:
        return self.name


class Author(TimeStampedModel):
    """
    Flexible author:
    - optionally links to a real user (admin/editor)
    - can also represent a brand/team author without a user account
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="blog_author_profile",
    )
    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, validators=[slug_validator])
    role = models.CharField(max_length=160, blank=True)
    avatar_url = models.URLField(blank=True)
    description = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return self.name


# -----------------------------
# Blog Post
# -----------------------------
class BlogPost(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SCHEDULED = "scheduled", "Scheduled"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    class PostType(models.TextChoices):
        BLOG = "blog", "Blog"
        PAGE = "page", "Page"
        VLOG = "vlog", "Vlog"

    class ContentType(models.TextChoices):
        ARTICLE = "article", "Article"
        GUIDE = "guide", "Guide"
        NEWS = "news", "News"

    class Difficulty(models.TextChoices):
        EASY = "Easy", "Easy"
        MODERATE = "Moderate", "Moderate"
        CHALLENGING = "Challenging", "Challenging"

    # Identity / publishing
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    type = models.CharField(max_length=20, choices=PostType.choices, default=PostType.BLOG)
    content_type = models.CharField(max_length=20, choices=ContentType.choices, default=ContentType.ARTICLE)

    language = models.CharField(max_length=10, default="en", db_index=True)

    slug = models.SlugField(max_length=255, validators=[slug_validator])
    title = models.CharField(max_length=220)
    subtitle = models.CharField(max_length=260, blank=True)

    # SEO meta (classic)
    meta_title = models.CharField(max_length=220, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)

    # Page content intro/excerpt
    description = models.TextField(blank=True)
    excerpt = models.CharField(max_length=400, blank=True)

    # Taxonomy
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")

    # Dates
    publish_date = models.DateTimeField(default=timezone.now, db_index=True)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)

    # Display helpers
    read_time = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(999)])
    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.MODERATE,
    )

    canonical_url = models.URLField(blank=True)

    # Primary images (simple + flexible)
    image = models.URLField(blank=True)  # card/thumbnail
    image_file = models.ImageField(upload_to="blog/images/", blank=True, null=True)
    featured_image = models.JSONField(default=default_featured_image, blank=True)
    featured_image_file = models.ImageField(upload_to="blog/featured/", blank=True, null=True)
    images = models.JSONField(default=default_images, blank=True)

    # Rich, flexible fields (store your full JSON payload safely)
    taxonomies = models.JSONField(default=default_taxonomies, blank=True)
    content_settings = models.JSONField(default=default_content_settings, blank=True)
    toc = models.JSONField(default=default_toc, blank=True)
    content = models.JSONField(default=default_content, blank=True)

    cta = models.JSONField(default=default_cta, blank=True)
    links = models.JSONField(default=default_links, blank=True)
    related_posts = models.JSONField(default=default_related_posts, blank=True)

    seo = models.JSONField(default=default_seo, blank=True)
    schema = models.JSONField(default=default_schema, blank=True)
    social = models.JSONField(default=default_social, blank=True)
    editorial = models.JSONField(default=default_editorial, blank=True)

    # Engagement (query-friendly)
    views = models.PositiveBigIntegerField(default=0)
    likes = models.PositiveBigIntegerField(default=0)
    shares = models.PositiveBigIntegerField(default=0)

    # Flags
    is_featured = models.BooleanField(default=False, db_index=True)
    allow_comments = models.BooleanField(default=True)

    is_liked = models.BooleanField(default=False)
    is_bookmarked = models.BooleanField(default=False)

    class Meta:
        ordering = ["-publish_date", "-id"]
        constraints = [
            models.UniqueConstraint(fields=["slug", "language"], name="uniq_blogpost_slug_language"),
        ]
        indexes = [
            models.Index(fields=["status", "publish_date"]),
            models.Index(fields=["type", "content_type"]),
            models.Index(fields=["is_featured", "publish_date"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.language})"

    # -----------------------------
    # SEO/content helpers
    # -----------------------------
    def _extract_plain_text(self, max_chars: int = 20000) -> str:
        """Best-effort plain-text extraction from description + rich blocks."""
        parts: list[str] = []
        if self.description:
            parts.append(self.description)

        try:
            blocks = (self.content or {}).get("blocks") or []
            for b in blocks:
                t = (b or {}).get("type")
                if t == "heading":
                    parts.append(str((b or {}).get("text") or ""))
                elif t in {"paragraph", "quote", "callout"}:
                    # paragraph spans may include text/link/image_inline
                    if t == "paragraph":
                        spans = (b or {}).get("spans") or []
                        for s in spans:
                            if (s or {}).get("type") in {"text", "link"}:
                                parts.append(str((s or {}).get("text") or ""))
                    else:
                        parts.append(str((b or {}).get("text") or ""))
                elif t in {"list", "faq"}:
                    items = (b or {}).get("items") or []
                    if t == "list":
                        parts.extend([str(x) for x in items])
                    else:
                        for qa in items:
                            parts.append(str((qa or {}).get("q") or ""))
                            parts.append(str((qa or {}).get("a") or ""))
        except Exception:
            pass

        text = "\n".join([p.strip() for p in parts if p and str(p).strip()])
        return text[:max_chars]

    def _ensure_excerpt(self) -> None:
        if self.excerpt:
            return
        # Prefer meta/description; fallback to first content paragraph.
        base = self.meta_description or self.description or self._extract_plain_text(max_chars=1200)
        base = " ".join(base.split())
        self.excerpt = base[:400]

    def _compute_read_time(self) -> None:
        if self.read_time and self.read_time > 0:
            return
        text = self._extract_plain_text(max_chars=50000)
        words = len([w for w in text.split() if w.strip()])
        # 200 wpm is a standard estimate for web reading
        minutes = max(1, round(words / 200)) if words else 0
        self.read_time = min(minutes, 999)

    def _ensure_canonical(self) -> None:
        if self.canonical_url:
            return
        base = getattr(settings, "FRONTEND_SITE_URL", "").rstrip("/")
        if base:
            self.canonical_url = f"{base}/blog/{self.slug}"

    def _sync_seo_defaults(self) -> None:
        """Make SEO blocks consistent without overwriting explicit values."""
        self.meta_title = self.meta_title or self.title
        if not self.meta_description:
            self.meta_description = (self.description or self.excerpt or "")[:320]

        # taxonomies -> seo keywords (if empty)
        tax = self.taxonomies or {}
        seo = self.seo or {}
        seo.setdefault("focusKeyword", tax.get("focusKeyword") or "")
        seo.setdefault("keywords", tax.get("keywords") or [])

        # OpenGraph defaults
        og = seo.get("openGraph") or {}
        og.setdefault("type", "article")
        og.setdefault("title", self.meta_title)
        og.setdefault("description", self.meta_description)
        og.setdefault("url", self.canonical_url or "")
        og_img = og.get("image") or {}
        og_img.setdefault("url", (self.featured_image or {}).get("url") or self.image or "")
        og_img.setdefault("alt", (self.featured_image or {}).get("alt") or self.title)
        og["image"] = og_img
        og.setdefault("siteName", getattr(settings, "SITE_NAME", ""))
        seo["openGraph"] = og

        # Twitter defaults
        tw = seo.get("twitter") or {}
        tw.setdefault("card", "summary_large_image")
        tw.setdefault("title", self.meta_title)
        tw.setdefault("description", self.meta_description)
        tw.setdefault("image", (self.featured_image or {}).get("url") or self.image or "")
        seo["twitter"] = tw

        self.seo = seo

        # Social share defaults
        social = self.social or {}
        share = social.get("share") or {}
        share.setdefault("enabled", True)
        share.setdefault("shareUrl", self.canonical_url or "")
        share.setdefault("shareTitle", self.title)
        share.setdefault("shareText", self.excerpt or self.meta_description or "")
        share.setdefault("hashtags", [])
        share.setdefault("utm", {"source": "social", "medium": "share", "campaign": ""})
        social["share"] = share
        self.social = social

    def _auto_generate_toc(self) -> None:
        settings_obj = self.content_settings or {}
        enabled = bool(settings_obj.get("tocEnabled", True))
        mode = settings_obj.get("tocMode", "auto")
        include_levels = set(settings_obj.get("tocIncludeLevels") or [2, 3])

        if not enabled or mode != "auto":
            return
        if self.toc:
            return

        toc_items: list[dict] = []
        try:
            for b in (self.content or {}).get("blocks") or []:
                if (b or {}).get("type") != "heading":
                    continue
                lvl = int((b or {}).get("level") or 2)
                if lvl not in include_levels:
                    continue
                text = str((b or {}).get("text") or "").strip()
                if not text:
                    continue
                hid = str((b or {}).get("id") or "").strip()
                if not hid:
                    hid = slugify(text)[:80] or f"h{lvl}"
                    b["id"] = hid  # keep block ids stable
                toc_items.append({"id": hid, "title": text, "level": lvl})
        except Exception:
            toc_items = []

        self.toc = toc_items

    def _update_editorial_checklist(self) -> None:
        editorial = self.editorial or default_editorial()
        qc = (editorial.get("qualityChecklist") or {})
        qc["hasFocusKeywordInTitle"] = bool((self.taxonomies or {}).get("focusKeyword") and (self.taxonomies or {}).get("focusKeyword").lower() in (self.title or "").lower())
        qc["hasMetaTitle"] = bool(self.meta_title)
        qc["hasMetaDescription"] = bool(self.meta_description)
        qc["hasCanonicalUrl"] = bool(self.canonical_url)
        qc["hasOpenGraph"] = bool((self.seo or {}).get("openGraph"))
        qc["hasTwitterCard"] = bool((self.seo or {}).get("twitter"))
        qc["hasInternalLinks"] = bool(((self.links or {}).get("internalLinks") or []))
        qc["hasExternalBacklinks"] = bool(((self.links or {}).get("backlinks") or []))
        qc["imagesHaveAltText"] = all(bool((img or {}).get("alt")) for img in (self.images or [])) if self.images else True
        qc["hasCTA"] = bool((self.cta or {}).get("primary", {}).get("href"))
        editorial["qualityChecklist"] = qc
        self.editorial = editorial

    def save(self, *args, **kwargs) -> None:
        """Centralized cleanup + SEO consistency.

        Keeps your JSON payload flexible while ensuring important SEO fields
        are always present for social sharing + SERP display.
        """

        # Slug history tracking
        old_slug: str | None = None
        if self.pk:
            old_slug = BlogPost.objects.filter(pk=self.pk).values_list("slug", flat=True).first()

        # Auto publish date (if marked published)
        if self.status == self.Status.PUBLISHED and not self.publish_date:
            self.publish_date = timezone.now()

        # Enrich
        self._ensure_canonical()
        self._ensure_excerpt()
        self._compute_read_time()
        self._auto_generate_toc()
        self._sync_seo_defaults()
        self._update_editorial_checklist()

        super().save(*args, **kwargs)

        updates = {}
        if self.image_file and not self.image:
            updates["image"] = self.image_file.url
        if self.featured_image_file:
            fi = self.featured_image or {}
            if not fi.get("url"):
                updates["featured_image"] = {**fi, "url": self.featured_image_file.url}
        if updates:
            BlogPost.objects.filter(pk=self.pk).update(**updates)
            for key, value in updates.items():
                setattr(self, key, value)

        # Create slug history entry if slug changed
        if old_slug and old_slug != self.slug:
            BlogPostSlugHistory.objects.get_or_create(
                post=self,
                old_slug=old_slug,
                defaults={"new_slug": self.slug},
            )

    @property
    def share_url(self) -> str:
        """
        Useful when generating share links.
        Priority:
        1) social.share.shareUrl
        2) canonical_url
        """
        try:
            share = (self.social or {}).get("share") or {}
            return share.get("shareUrl") or self.canonical_url or ""
        except Exception:
            return self.canonical_url or ""


# -----------------------------
# Optional: Slug history (SEO-friendly redirects)
# -----------------------------
class BlogPostSlugHistory(TimeStampedModel):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="slug_history")
    old_slug = models.SlugField(max_length=255, validators=[slug_validator], db_index=True)
    new_slug = models.SlugField(max_length=255, validators=[slug_validator], db_index=True)
    redirect_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [("post", "old_slug", "new_slug")]
        indexes = [
            models.Index(fields=["old_slug"]),
            models.Index(fields=["new_slug"]),
        ]

    def __str__(self) -> str:
        return f"{self.old_slug} → {self.new_slug}"
