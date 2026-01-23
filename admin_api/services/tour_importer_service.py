from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional, Tuple

from django.db import transaction
from django.db.models import Avg
from django.utils.text import slugify

from travel_styles.models import TravelStyle

from tours.models import (
    Tour,
    TourOverview,
    TourItineraryDay,
    TourHighlight,
    TourCost,
    TourAdditionalInfoSection,
    TourGroupPrice,
    TourGalleryImage,
    TourSEO,
    TourInternalLink,
    TourBacklink,
    SimilarTour,
    TourReview,
)


def _s(v: Any) -> str:
    return str(v).strip() if v is not None else ""


def _int(v: Any, default: Optional[int] = None) -> Optional[int]:
    if v is None or v == "":
        return default
    try:
        return int(v)
    except (TypeError, ValueError):
        raise ValueError(f"Expected int, got: {v!r}")


def _float(v: Any, default: Optional[float] = None) -> Optional[float]:
    if v is None or v == "":
        return default
    try:
        return float(v)
    except (TypeError, ValueError):
        raise ValueError(f"Expected float, got: {v!r}")


def _bool(v: Any, default: bool = False) -> bool:
    if v is None:
        return default
    if isinstance(v, bool):
        return v
    return _s(v).lower() in {"1", "true", "yes", "y", "on"}


def _require(v: Any, field: str) -> Any:
    if v is None or (isinstance(v, str) and not v.strip()):
        raise ValueError(f"{field} is required")
    return v


def _resolve_style(slug: Any) -> Optional[TravelStyle]:
    candidate = _s(slug)
    if not candidate:
        return None
    return TravelStyle.objects.filter(slug__iexact=candidate).first()


def _coerce_style_slugs(value: Any) -> List[str]:
    if value is None:
        return []
    if isinstance(value, (list, tuple)):
        items = value
    else:
        items = [value]
    slugs: List[str] = []
    for item in items:
        if item is None:
            continue
        if isinstance(item, dict):
            candidate = item.get("slug") or item.get("name") or item.get("value") or ""
        else:
            candidate = item
        slug_value = _s(candidate)
        if slug_value:
            slugs.append(slug_value)
    return slugs


def sync_style_relations(tour: Tour, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    warnings: List[Dict[str, Any]] = []
    primary_slug = _s(payload.get("primary_style") or payload.get("primaryStyle"))
    primary_style = _resolve_style(primary_slug) if primary_slug else None

    travel_style_slugs = _coerce_style_slugs(payload.get("travel_styles") or payload.get("travelStyles"))
    unique_slugs = []
    for slug in travel_style_slugs:
        normalized = slug.lower()
        if normalized not in unique_slugs:
            unique_slugs.append(normalized)

    styles_to_set: List[TravelStyle] = []
    for slug in unique_slugs:
        style = _resolve_style(slug)
        if style:
            styles_to_set.append(style)
        else:
            warnings.append(
                {"type": "travel_style", "slug": slug, "warning": "Style slug not found; ignored."}
            )

    if primary_style and primary_style not in styles_to_set:
        styles_to_set.insert(0, primary_style)

    to_save = []
    desired_slug = ""
    if primary_style and primary_style.slug:
        desired_slug = primary_style.slug
    elif styles_to_set:
        desired_slug = styles_to_set[0].slug or ""

    if tour.primary_style_id != (primary_style.id if primary_style else None):
        tour.primary_style = primary_style
        to_save.append("primary_style")
    if tour.travel_style != desired_slug:
        tour.travel_style = desired_slug
        to_save.append("travel_style")

    if to_save:
        tour.save(update_fields=to_save)

    tour.travel_styles.set(styles_to_set)
    return warnings


@dataclass
class TourImportStats:
    tours_created: int = 0
    tours_updated: int = 0
    overview_replaced: int = 0
    itinerary_replaced: int = 0
    highlights_replaced: int = 0
    cost_upserted: int = 0
    additional_info_replaced: int = 0
    group_prices_replaced: int = 0
    gallery_replaced: int = 0
    seo_upserted: int = 0
    internal_links_replaced: int = 0
    backlinks_replaced: int = 0
    similar_tours_replaced: int = 0
    reviews_replaced: int = 0


def upsert_tour(payload: Dict[str, Any]) -> Tuple[Tour, bool]:
    title = _s(_require(payload.get("title"), "tours[].title"))
    slug = _s(payload.get("slug")) or slugify(title)[:120]
    if not slug:
        raise ValueError("tours[].slug is required")

    defaults = {
        "title": title,
        "location": _s(payload.get("location")),
        "tagline": _s(payload.get("tagline")),
        "short_description": _s(payload.get("short_description") or payload.get("shortDescription")),
        "long_description": _s(payload.get("long_description") or payload.get("longDescription")),
        "image_url": _s(payload.get("image_url") or payload.get("image")),
        "duration": _s(payload.get("duration")),
        "group_size": _int(payload.get("group_size") or payload.get("groupSize")),
        "difficulty": _s(payload.get("difficulty")),
        "start_point": _s(payload.get("start_point") or payload.get("startPoint")),
        "max_altitude": _s(payload.get("max_altitude") or payload.get("maxAltitude")),
        "activity": _s(payload.get("activity")),
        "travel_style": _s(payload.get("travel_style") or payload.get("travelStyle")),
        "badge": _s(payload.get("badge")),
        "rating": _float(payload.get("rating"), 0.0) or 0.0,
        "reviews_count": _int(payload.get("reviews_count") or payload.get("reviews"), 0) or 0,
        "price": payload.get("price") or payload.get("base_price") or payload.get("basePrice"),
        "old_price": payload.get("old_price") or payload.get("oldPrice"),
        "base_price": payload.get("base_price") or payload.get("basePrice"),
        "original_price": payload.get("original_price") or payload.get("originalPrice"),
        "tags": payload.get("tags") or [],
        "categories": payload.get("categories") or [],
        "highlights": payload.get("highlights") or [],
        "is_published": _bool(payload.get("is_published"), True),
    }

    tour, created = Tour.objects.update_or_create(slug=slug, defaults=defaults)
    return tour, created


def upsert_overview(tour: Tour, payload: Dict[str, Any]) -> None:
    TourOverview.objects.update_or_create(
        tour=tour,
        defaults={
            "heading": _s(payload.get("heading")),
            "paragraphs": payload.get("paragraphs") or [],
            "points": payload.get("points") or [],
        },
    )


def replace_itinerary(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourItineraryDay.objects.filter(tour=tour).delete()
    for item in items:
        TourItineraryDay.objects.create(
            tour=tour,
            day=_int(_require(item.get("day"), "itinerary_days[].day")),
            title=_s(_require(item.get("title"), "itinerary_days[].title")),
            description=_s(item.get("description")),
            duration=_s(item.get("duration")),
            distance=_s(item.get("distance")),
            meals=_s(item.get("meals")),
        )


def replace_highlights(tour: Tour, items: List[Any]) -> None:
    TourHighlight.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        if isinstance(item, dict):
            text = _s(item.get("text") or item.get("title"))
        else:
            text = _s(item)
        if not text:
            continue
        TourHighlight.objects.create(tour=tour, text=text, order=order)


def upsert_cost(tour: Tour, payload: Dict[str, Any]) -> None:
    TourCost.objects.update_or_create(
        tour=tour,
        defaults={
            "inclusions": payload.get("inclusions") or [],
            "exclusions": payload.get("exclusions") or [],
        },
    )


def replace_additional_info(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourAdditionalInfoSection.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        TourAdditionalInfoSection.objects.create(
            tour=tour,
            heading=_s(item.get("heading")),
            body=_s(item.get("body")),
            articles=item.get("articles") or [],
            bullets=item.get("bullets") or [],
            order=_int(item.get("order"), order) or order,
        )


def replace_group_prices(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourGroupPrice.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        TourGroupPrice.objects.create(
            tour=tour,
            label=_s(item.get("label") or item.get("size")),
            price=item.get("price") or 0,
            min_size=_int(item.get("min_size") or item.get("minSize")),
            max_size=_int(item.get("max_size") or item.get("maxSize")),
            order=_int(item.get("order"), order) or order,
        )


def replace_gallery(tour: Tour, items: List[Any]) -> None:
    TourGalleryImage.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        if isinstance(item, dict):
            image_url = _s(item.get("image_url") or item.get("image") or item.get("url"))
            caption = _s(item.get("caption"))
            alt_text = _s(item.get("alt_text") or item.get("alt"))
        else:
            image_url = _s(item)
            caption = ""
            alt_text = ""
        if not image_url:
            continue
        TourGalleryImage.objects.create(
            tour=tour,
            image_url=image_url,
            caption=caption,
            alt_text=alt_text,
            order=_int(item.get("order"), order) if isinstance(item, dict) else order,
        )


def upsert_seo(tour: Tour, payload: Dict[str, Any]) -> None:
    TourSEO.objects.update_or_create(
        tour=tour,
        defaults={
            "meta_title": _s(payload.get("meta_title") or payload.get("metaTitle")),
            "meta_description": _s(payload.get("meta_description") or payload.get("metaDescription")),
            "meta_keywords": payload.get("meta_keywords") or payload.get("metaKeywords") or [],
            "canonical_url": _s(payload.get("canonical_url") or payload.get("canonicalUrl")),
            "focus_keyword": _s(payload.get("focus_keyword") or payload.get("focusKeyword")),
            "og_title": _s(payload.get("og_title") or payload.get("ogTitle")),
            "og_description": _s(payload.get("og_description") or payload.get("ogDescription")),
            "og_image_url": _s(payload.get("og_image_url") or payload.get("ogImageUrl")),
            "twitter_title": _s(payload.get("twitter_title") or payload.get("twitterTitle")),
            "twitter_description": _s(payload.get("twitter_description") or payload.get("twitterDescription")),
            "twitter_image_url": _s(payload.get("twitter_image_url") or payload.get("twitterImageUrl")),
            "robots_noindex": _bool(payload.get("robots_noindex"), False),
            "robots_nofollow": _bool(payload.get("robots_nofollow"), False),
            "breadcrumbs": payload.get("breadcrumbs") or [],
            "structured_data": payload.get("structured_data") or payload.get("structuredData") or {},
        },
    )


def replace_internal_links(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourInternalLink.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        TourInternalLink.objects.create(
            tour=tour,
            label=_s(_require(item.get("label"), "internal_links[].label")),
            url=_s(_require(item.get("url"), "internal_links[].url")),
            section=_s(item.get("section")),
            order=_int(item.get("order"), order) or order,
        )


def replace_backlinks(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourBacklink.objects.filter(tour=tour).delete()
    for item in items:
        TourBacklink.objects.create(
            tour=tour,
            source_name=_s(item.get("source_name") or item.get("sourceName")),
            url=_s(_require(item.get("url"), "backlinks[].url")),
            anchor_text=_s(item.get("anchor_text") or item.get("anchorText")),
            rel=_s(item.get("rel")),
            discovered_at=item.get("discovered_at") or item.get("discoveredAt"),
            is_active=_bool(item.get("is_active"), True),
        )


def replace_similar_tours(tour: Tour, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    warnings: List[Dict[str, Any]] = []
    SimilarTour.objects.filter(tour=tour).delete()
    for order, item in enumerate(items):
        related_slug = _s(item.get("related_slug") or item.get("relatedSlug") or item.get("slug"))
        if not related_slug:
            continue
        related = Tour.objects.filter(slug=related_slug).first()
        if not related:
            warnings.append(
                {
                    "type": "similar_tour",
                    "tour": tour.slug,
                    "related_slug": related_slug,
                    "warning": "Related tour not found; skipped.",
                }
            )
            continue
        SimilarTour.objects.create(tour=tour, related_tour=related, order=_int(item.get("order"), order) or order)
    return warnings


def replace_reviews(tour: Tour, items: List[Dict[str, Any]]) -> None:
    TourReview.objects.filter(tour=tour).delete()
    for item in items:
        TourReview.objects.create(
            tour=tour,
            author_name=_s(_require(item.get("author_name") or item.get("author"), "reviews_list[].author_name")),
            rating=_int(item.get("rating"), 5) or 5,
            title=_s(item.get("title")),
            body=_s(item.get("body") or item.get("text")),
            source_name=_s(item.get("source_name") or item.get("sourceName")),
            source_url=_s(item.get("source_url") or item.get("sourceUrl")),
            published_at=item.get("published_at") or item.get("publishedAt"),
            is_published=_bool(item.get("is_published"), True),
        )
    agg = TourReview.objects.filter(tour=tour, is_published=True).aggregate(
        rating=Avg("rating"),
    )
    total = TourReview.objects.filter(tour=tour, is_published=True).count()
    Tour.objects.filter(pk=tour.pk).update(rating=agg.get("rating") or 0.0, reviews_count=total)


def import_tours_payload(payload: Dict[str, Any], actor=None) -> Dict[str, Any]:
    tours_payload = payload.get("tours") or payload.get("items") or payload.get("tour_list") or []
    if tours_payload is None or not isinstance(tours_payload, list):
        return {"ok": False, "error": "`tours` must be a list"}

    stats = TourImportStats()
    errors: List[Dict[str, Any]] = []
    warnings: List[Dict[str, Any]] = []

    for idx, tour_payload in enumerate(tours_payload):
        if not isinstance(tour_payload, dict):
            errors.append({"type": "tour", "index": idx, "error": "Invalid tour payload"})
            continue
        try:
            with transaction.atomic():
                tour, created = upsert_tour(tour_payload)
                if created:
                    stats.tours_created += 1
                else:
                    stats.tours_updated += 1

                warnings.extend(sync_style_relations(tour, tour_payload))

                upsert_overview(tour, tour_payload.get("overview") or {})
                stats.overview_replaced += 1

                replace_itinerary(tour, tour_payload.get("itinerary_days") or tour_payload.get("itineraryDays") or [])
                stats.itinerary_replaced += 1

                replace_highlights(tour, tour_payload.get("highlights") or tour_payload.get("highlight_items") or [])
                stats.highlights_replaced += 1

                upsert_cost(tour, tour_payload.get("cost") or {})
                stats.cost_upserted += 1

                replace_additional_info(
                    tour,
                    tour_payload.get("additional_info_sections")
                    or tour_payload.get("additionalInfo")
                    or [],
                )
                stats.additional_info_replaced += 1

                replace_group_prices(tour, tour_payload.get("group_prices") or tour_payload.get("groupPrices") or [])
                stats.group_prices_replaced += 1

                replace_gallery(tour, tour_payload.get("gallery_images") or tour_payload.get("gallery") or [])
                stats.gallery_replaced += 1

                upsert_seo(tour, tour_payload.get("seo") or {})
                stats.seo_upserted += 1

                replace_internal_links(tour, tour_payload.get("internal_links") or [])
                stats.internal_links_replaced += 1

                replace_backlinks(tour, tour_payload.get("backlinks") or [])
                stats.backlinks_replaced += 1

                warnings.extend(replace_similar_tours(tour, tour_payload.get("similar_tours") or []))
                if tour_payload.get("similar_tours"):
                    stats.similar_tours_replaced += 1

                replace_reviews(tour, tour_payload.get("reviews_list") or [])
                if tour_payload.get("reviews_list"):
                    stats.reviews_replaced += 1
        except Exception as exc:
            errors.append({"type": "tour", "index": idx, "slug": tour_payload.get("slug"), "error": str(exc)})

    return {
        "ok": len(errors) == 0,
        "stats": asdict(stats),
        "errors": errors,
        "warnings": warnings,
    }
