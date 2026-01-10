from __future__ import annotations

from typing import Any, Dict, List

from django.db import transaction
from django.utils.text import slugify

from blog.blog.models import BlogPost, Category, Region, Author
from admin_api.serializers.blog import BlogAdminSerializer


SNAKE_TO_CAMEL = {
    "content_type": "contentType",
    "meta_title": "metaTitle",
    "meta_description": "metaDescription",
    "publish_date": "publishDate",
    "updated_at": "updatedAt",
    "created_at": "createdAt",
    "last_reviewed_at": "lastReviewedAt",
    "read_time": "readTime",
    "canonical_url": "canonicalUrl",
    "featured_image": "featuredImage",
    "image_file": "imageFile",
    "featured_image_file": "featuredImageFile",
    "content_settings": "contentSettings",
    "related_posts": "relatedPosts",
    "is_featured": "isFeatured",
    "allow_comments": "allowComments",
    "is_liked": "isLiked",
    "is_bookmarked": "isBookmarked",
    "category_id": "categoryId",
    "region_id": "regionId",
    "author_id": "authorId",
    "category_slug": "categorySlug",
    "region_slug": "regionSlug",
    "author_slug": "authorSlug",
}


def _resolve_fk(model, value: Any):
    if value in (None, ""):
        return None
    if isinstance(value, int):
        return model.objects.filter(id=value).first()
    if isinstance(value, dict):
        if value.get("id"):
            return model.objects.filter(id=value.get("id")).first()
        if value.get("slug"):
            return model.objects.filter(slug=value.get("slug")).first()
        if value.get("name"):
            return model.objects.filter(name=value.get("name")).first()
        return None
    if isinstance(value, str):
        return model.objects.filter(slug=value).first() or model.objects.filter(name=value).first()
    return None


def _normalize_blog_payload(raw: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(raw, dict):
        return {}

    data = dict(raw)

    # Normalize snake_case to camelCase for admin serializer.
    for snake, camel in SNAKE_TO_CAMEL.items():
        if snake in data and camel not in data:
            data[camel] = data.pop(snake)

    # Lift engagement/flags if provided.
    engagement = data.pop("engagement", None) or {}
    flags = data.pop("flags", None) or {}
    if isinstance(engagement, dict):
        data.setdefault("views", engagement.get("views"))
        data.setdefault("likes", engagement.get("likes"))
        data.setdefault("shares", engagement.get("shares"))
    if isinstance(flags, dict):
        data.setdefault("isFeatured", flags.get("isFeatured"))
        data.setdefault("allowComments", flags.get("allowComments"))
        data.setdefault("isLiked", flags.get("isLiked"))
        data.setdefault("isBookmarked", flags.get("isBookmarked"))

    author_payload = data.pop("author", None)
    if author_payload and "authorId" not in data and "authorSlug" not in data:
        if isinstance(author_payload, dict):
            if author_payload.get("id"):
                data["authorId"] = author_payload.get("id")
            elif author_payload.get("slug"):
                data["authorSlug"] = author_payload.get("slug")
            elif author_payload.get("name"):
                data["authorSlug"] = slugify(author_payload.get("name"))
        elif isinstance(author_payload, str):
            data["authorSlug"] = author_payload
    if author_payload:
        data["_author_payload"] = author_payload

    # Convert nested taxonomy objects to ids/slugs if provided.
    if "category" in data and "categoryId" not in data and "categorySlug" not in data:
        raw_category = data.pop("category")
        cat = _resolve_fk(Category, raw_category)
        if cat:
            data["categoryId"] = cat.id
        elif isinstance(raw_category, dict) and raw_category.get("slug"):
            data["categorySlug"] = raw_category.get("slug")
        elif isinstance(raw_category, str):
            data["categorySlug"] = slugify(raw_category)
    if "region" in data and "regionId" not in data and "regionSlug" not in data:
        raw_region = data.pop("region")
        reg = _resolve_fk(Region, raw_region)
        if reg:
            data["regionId"] = reg.id
        elif isinstance(raw_region, dict) and raw_region.get("slug"):
            data["regionSlug"] = raw_region.get("slug")
        elif isinstance(raw_region, str):
            data["regionSlug"] = slugify(raw_region)

    # Clean unsupported file inputs for JSON import.
    if isinstance(data.get("imageFile"), str):
        data.pop("imageFile", None)
    if isinstance(data.get("featuredImageFile"), str):
        data.pop("featuredImageFile", None)

    if not data.get("language"):
        data["language"] = "en"

    return data


def import_blog_posts(payload: Dict[str, Any], actor=None) -> Dict[str, Any]:
    posts = payload.get("posts") or payload.get("blog_posts") or payload.get("items")
    if isinstance(posts, dict):
        posts = [posts]
    posts = posts or []

    result = {"ok": True, "created": 0, "updated": 0, "errors": []}
    if not posts:
        result["ok"] = False
        result["errors"].append({"detail": "No posts provided."})
        return result

    for idx, raw in enumerate(posts):
        data = _normalize_blog_payload(raw or {})
        slug = data.get("slug")
        language = data.get("language") or "en"
        if not slug:
            result["ok"] = False
            result["errors"].append({"index": idx, "detail": "Missing slug"})
            continue

        instance = BlogPost.objects.filter(slug=slug, language=language).first()
        author_payload = data.pop("_author_payload", None)

        if author_payload and not data.get("authorId"):
            if isinstance(author_payload, dict):
                author_slug = data.get("authorSlug") or author_payload.get("slug") or slugify(author_payload.get("name") or "")
                if author_slug:
                    author, _ = Author.objects.get_or_create(
                        slug=author_slug,
                        defaults={"name": author_payload.get("name") or author_slug.replace("-", " ").title()},
                    )
                    author.name = author_payload.get("name") or author.name
                    author.role = author_payload.get("role") or author.role
                    author.avatar_url = author_payload.get("avatarUrl") or author_payload.get("avatar_url") or author.avatar_url
                    author.description = author_payload.get("description") or author.description
                    author.save()
                    data["authorId"] = author.id

        serializer = BlogAdminSerializer(
            instance=instance,
            data=data,
            partial=bool(instance),
        )

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as exc:
            result["ok"] = False
            result["errors"].append({"index": idx, "slug": slug, "detail": str(exc)})
            continue

        with transaction.atomic():
            serializer.save()

        if instance:
            result["updated"] += 1
        else:
            result["created"] += 1

    return result
