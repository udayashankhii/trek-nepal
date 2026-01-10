"""blog/serializers.py

These serializers are designed to match a front-end friendly (camelCase)
JSON contract like the payload you shared.

Public API is read-only in this app (you can add an admin API later), but
`BlogPostWriteSerializer` is included for future use.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

from django.db import transaction
from rest_framework import serializers

from .models import Author, BlogPost, Category, Region


# -----------------------------
# Small helpers
# -----------------------------


class CamelModelSerializer(serializers.ModelSerializer):
    """ModelSerializer with explicit camelCase fields.

    We intentionally do NOT try to auto-convert keys globally.
    Explicit fields are clearer and safer for APIs.
    """


class CategorySerializer(CamelModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        ]


class RegionSerializer(CamelModelSerializer):
    class Meta:
        model = Region
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        ]


class AuthorSerializer(CamelModelSerializer):
    avatarUrl = serializers.URLField(source="avatar_url", required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Author
        fields = [
            "id",
            "name",
            "slug",
            "role",
            "avatarUrl",
            "description",
            "created_at",
            "updated_at",
        ]


class BlogPostBaseSerializer(CamelModelSerializer):
    # --- camelCase mappings ---
    contentType = serializers.CharField(source="content_type")

    metaTitle = serializers.CharField(source="meta_title", required=False, allow_blank=True)
    metaDescription = serializers.CharField(source="meta_description", required=False, allow_blank=True)

    publishDate = serializers.DateTimeField(source="publish_date")
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    lastReviewedAt = serializers.DateTimeField(source="last_reviewed_at", required=False, allow_null=True)

    readTime = serializers.IntegerField(source="read_time", required=False)

    canonicalUrl = serializers.URLField(source="canonical_url", required=False, allow_blank=True)

    featuredImage = serializers.JSONField(source="featured_image", required=False)
    imageFile = serializers.ImageField(source="image_file", required=False, allow_null=True)
    featuredImageFile = serializers.ImageField(source="featured_image_file", required=False, allow_null=True)

    # Derived strings for FE convenience
    category = serializers.SerializerMethodField()
    categorySlug = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    regionSlug = serializers.SerializerMethodField()

    author = serializers.SerializerMethodField()

    engagement = serializers.SerializerMethodField()
    flags = serializers.SerializerMethodField()

    def get_category(self, obj: BlogPost) -> str:
        return obj.category.name if obj.category else ""

    def get_categorySlug(self, obj: BlogPost) -> str:
        return obj.category.slug if obj.category else ""

    def get_region(self, obj: BlogPost) -> str:
        return obj.region.name if obj.region else ""

    def get_regionSlug(self, obj: BlogPost) -> str:
        return obj.region.slug if obj.region else ""

    def get_author(self, obj: BlogPost) -> dict[str, Any] | None:
        if not obj.author:
            return None
        return {
            "name": obj.author.name,
            "slug": obj.author.slug,
            "role": obj.author.role,
            "avatarUrl": obj.author.avatar_url,
            "description": obj.author.description,
        }

    def get_engagement(self, obj: BlogPost) -> dict[str, int]:
        return {"views": int(obj.views), "likes": int(obj.likes), "shares": int(obj.shares)}

    def get_flags(self, obj: BlogPost) -> dict[str, Any]:
        return {
            "isFeatured": bool(obj.is_featured),
            "allowComments": bool(obj.allow_comments),
            "isLiked": bool(obj.is_liked),
            "isBookmarked": bool(obj.is_bookmarked),
        }


class BlogPostListSerializer(BlogPostBaseSerializer):
    """Lightweight serializer for listing cards."""

    # tags are stored inside taxonomies JSON
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj: BlogPost) -> list[str]:
        try:
            return list((obj.taxonomies or {}).get("tags") or [])
        except Exception:
            return []

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "status",
            "type",
            "contentType",
            "slug",
            "title",
            "subtitle",
            "excerpt",
            "metaTitle",
            "metaDescription",
            "language",
            "category",
            "categorySlug",
            "region",
            "regionSlug",
            "author",
            "publishDate",
            "updatedAt",
            "readTime",
            "difficulty",
            "canonicalUrl",
            "image",
            "featuredImage",
            "imageFile",
            "featuredImageFile",
            "tags",
            "engagement",
            "flags",
        ]


class BlogPostSerializer(BlogPostBaseSerializer):
    """Full post serializer (detail view)."""

    # Everything below is JSON stored as-is (flexible future-proofing)
    taxonomies = serializers.JSONField(required=False)
    contentSettings = serializers.JSONField(source="content_settings", required=False)
    toc = serializers.JSONField(required=False)
    content = serializers.JSONField(required=False)

    cta = serializers.JSONField(required=False)
    links = serializers.JSONField(required=False)
    relatedPosts = serializers.JSONField(source="related_posts", required=False)

    seo = serializers.JSONField(required=False)
    schema = serializers.JSONField(required=False)
    social = serializers.JSONField(required=False)
    editorial = serializers.JSONField(required=False)

    images = serializers.JSONField(required=False)

    # convenience: focus keyword is inside taxonomies
    focusKeyword = serializers.SerializerMethodField()
    shareLinks = serializers.SerializerMethodField()

    def get_focusKeyword(self, obj: BlogPost) -> str:
        try:
            return (obj.taxonomies or {}).get("focusKeyword") or ""
        except Exception:
            return ""

    def get_shareLinks(self, obj: BlogPost) -> dict[str, str]:
        share_url = (obj.share_url or obj.canonical_url or "").strip()
        title = (obj.title or "").strip()
        text = (obj.excerpt or obj.meta_description or obj.description or "").strip()

        if not share_url:
            return {}

        url = quote(share_url, safe="")
        title_q = quote(title, safe="")
        text_q = quote(text, safe="")

        return {
            "facebook": f"https://www.facebook.com/sharer/sharer.php?u={url}",
            "x": f"https://twitter.com/intent/tweet?url={url}&text={text_q}",
            "linkedin": f"https://www.linkedin.com/sharing/share-offsite/?url={url}",
            "whatsapp": f"https://api.whatsapp.com/send?text={text_q}%20{url}",
            "telegram": f"https://t.me/share/url?url={url}&text={text_q}",
            "reddit": f"https://www.reddit.com/submit?url={url}&title={title_q}",
            "pinterest": f"https://pinterest.com/pin/create/button/?url={url}&description={text_q}",
            "email": f"mailto:?subject={title_q}&body={text_q}%0A%0A{url}",
        }

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "status",
            "type",
            "contentType",
            "slug",
            "title",
            "subtitle",
            "metaTitle",
            "metaDescription",
            "description",
            "excerpt",
            "language",
            "category",
            "categorySlug",
            "region",
            "regionSlug",
            "author",
            "publishDate",
            "updatedAt",
            "lastReviewedAt",
            "readTime",
            "difficulty",
            "canonicalUrl",
            "image",
            "featuredImage",
            "imageFile",
            "featuredImageFile",
            "images",
            "focusKeyword",
            "shareLinks",
            "taxonomies",
            "contentSettings",
            "toc",
            "content",
            "cta",
            "links",
            "relatedPosts",
            "social",
            "seo",
            "schema",
            "editorial",
            "engagement",
            "flags",
        ]


# -----------------------------
# Write serializer (for later admin API)
# -----------------------------


class BlogPostWriteSerializer(BlogPostSerializer):
    """Accepts the same camelCase payload as BlogPostSerializer returns.

    Not wired to any endpoints in this app (yet).
    """

    # allow nested author object in payload
    author = serializers.JSONField(required=False, allow_null=True)
    categorySlug = serializers.CharField(write_only=True, required=False, allow_blank=True)
    regionSlug = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta(BlogPostSerializer.Meta):
        read_only_fields = ["id", "updatedAt", "engagement"]

    def validate(self, attrs):
        # Basic sanity: ensure slug is present
        slug = attrs.get("slug")
        if not slug:
            raise serializers.ValidationError({"slug": "slug is required"})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        author_payload = validated_data.pop("author", None)
        category_slug = validated_data.pop("categorySlug", "")
        region_slug = validated_data.pop("regionSlug", "")

        if category_slug:
            cat, _ = Category.objects.get_or_create(slug=category_slug, defaults={"name": category_slug.replace("-", " ").title()})
            validated_data["category"] = cat
        if region_slug:
            reg, _ = Region.objects.get_or_create(slug=region_slug, defaults={"name": region_slug.replace("-", " ").title()})
            validated_data["region"] = reg

        if author_payload and isinstance(author_payload, dict):
            a_slug = (author_payload.get("slug") or "").strip()
            if a_slug:
                author, _ = Author.objects.get_or_create(
                    slug=a_slug,
                    defaults={
                        "name": author_payload.get("name") or a_slug.replace("-", " ").title(),
                        "role": author_payload.get("role") or "",
                        "avatar_url": author_payload.get("avatarUrl") or "",
                    },
                )
                # Update basics (idempotent)
                author.name = author_payload.get("name") or author.name
                author.role = author_payload.get("role") or author.role
                author.avatar_url = author_payload.get("avatarUrl") or author.avatar_url
                author.save()
                validated_data["author"] = author

        return BlogPost.objects.create(**validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        author_payload = validated_data.pop("author", None)
        category_slug = validated_data.pop("categorySlug", "")
        region_slug = validated_data.pop("regionSlug", "")

        if category_slug:
            cat, _ = Category.objects.get_or_create(slug=category_slug, defaults={"name": category_slug.replace("-", " ").title()})
            instance.category = cat
        if region_slug:
            reg, _ = Region.objects.get_or_create(slug=region_slug, defaults={"name": region_slug.replace("-", " ").title()})
            instance.region = reg

        if author_payload and isinstance(author_payload, dict):
            a_slug = (author_payload.get("slug") or "").strip()
            if a_slug:
                author, _ = Author.objects.get_or_create(
                    slug=a_slug,
                    defaults={
                        "name": author_payload.get("name") or a_slug.replace("-", " ").title(),
                        "role": author_payload.get("role") or "",
                        "avatar_url": author_payload.get("avatarUrl") or "",
                    },
                )
                author.name = author_payload.get("name") or author.name
                author.role = author_payload.get("role") or author.role
                author.avatar_url = author_payload.get("avatarUrl") or author.avatar_url
                author.save()
                instance.author = author

        # Apply rest fields
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance
