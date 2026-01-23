# admin_api/services/importer_service.py
from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional, Tuple

from django.db import transaction
from django.utils.text import slugify

from TrekCard.models import (
    Region,
    TrekInfo,

    TrekOverview,
    TrekOverviewSection,
    TrekOverviewBullet,

    TrekItineraryDay,
    TrekHighlight,

    TrekAction,

    Cost,
    TrekDeparture,
    TrekGroupPrice,
    TrekDateHighlight,
    TrekCostAndDateSection,

    TrekFAQCategory,
    TrekFAQ,

    TrekGalleryImage,
    TrekHeroSection,

    TrekElevationChart,
    TrekElevationPoint,

    TrekBookingCard,
    TrekBookingGroupPrice,

    TrekAdditionalInfoSection,
    TrekAdditionalInfoBullet,

    SimilarTrek,

    TrekReview,
)


# -------------------------------------------------------
# Helpers
# -------------------------------------------------------

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


def _set_filefield_from_path(instance, field_name: str, rel_path: Optional[str]) -> None:
    """
    Path-based media mapping:
    - JSON provides "xxx_path" relative to MEDIA storage.
    - We set FileField/ImageField .name to that path (no upload).
    """
    rel_path = _s(rel_path)
    if not rel_path:
        return
    f = getattr(instance, field_name, None)
    if f is None:
        return
    f.name = rel_path


# -------------------------------------------------------
# Stats (admin UI can display this)
# -------------------------------------------------------

@dataclass
class ImportStats:
    regions_upserted: int = 0
    treks_created: int = 0
    treks_updated: int = 0

    hero_upserted: int = 0
    overview_replaced: int = 0
    itinerary_replaced: int = 0
    highlights_replaced: int = 0

    action_upserted: int = 0
    cost_upserted: int = 0
    cost_date_section_upserted: int = 0
    departures_replaced: int = 0
    group_prices_replaced: int = 0
    date_highlights_replaced: int = 0

    faq_replaced: int = 0
    gallery_replaced: int = 0

    elevation_upserted: int = 0
    elevation_points_replaced: int = 0

    booking_card_upserted: int = 0
    booking_group_prices_replaced: int = 0

    additional_info_replaced: int = 0
    similar_treks_replaced: int = 0

    reviews_replaced: int = 0


# -------------------------------------------------------
# Core upserts
# -------------------------------------------------------

def upsert_region(payload: Dict[str, Any]) -> Region:
    slug = _s(payload.get("slug"))
    if not slug:
        name = _s(_require(payload.get("name"), "regions[].name"))
        slug = slugify(name)

    region, _ = Region.objects.update_or_create(
        slug=slug,
        defaults={
            "name": _s(payload.get("name")) or slug.replace("-", " ").title(),
            "short_label": _s(payload.get("short_label")),
            "order": _int(payload.get("order"), 0) or 0,
            "marker_x": _int(payload.get("marker_x"), 50) or 50,
            "marker_y": _int(payload.get("marker_y"), 50) or 50,
        },
    )

    # cover_path -> Region.cover
    cover_path = payload.get("cover_path")
    if cover_path:
        _set_filefield_from_path(region, "cover", cover_path)
        region.save(update_fields=["cover"])

    return region


def upsert_trek(payload: Dict[str, Any], region_map: Dict[str, Region]) -> Tuple[TrekInfo, bool]:
    slug = _s(_require(payload.get("slug"), "treks[].slug"))
    title = _s(_require(payload.get("title"), "treks[].title"))
    region_slug = _s(_require(payload.get("region_slug"), "treks[].region_slug"))

    region = region_map.get(region_slug) or Region.objects.get(slug=region_slug)

    trek, created = TrekInfo.objects.update_or_create(
        slug=slug,
        defaults={
            "title": title,
            "region": region,
            "duration": _s(payload.get("duration")),
            "trip_grade": _s(payload.get("trip_grade")),
            "start_point": _s(payload.get("start_point")),
            "group_size": _s(payload.get("group_size")),
            "max_altitude": _s(payload.get("max_altitude")),
            "activity": _s(payload.get("activity")),
            "review_text": _s(payload.get("review_text")),
            # rating/reviews are aggregates (signals update them),
            # but we allow optional direct set too.
            "rating": _float(payload.get("rating"), 0.0) or 0.0,
            "reviews": _int(payload.get("reviews"), 0) or 0,
        },
    )
    return trek, created


# -------------------------------------------------------
# Nested importers
# -------------------------------------------------------

def upsert_hero_section(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    hero, _ = TrekHeroSection.objects.update_or_create(
        trek=trek,
        defaults={
            "title": _s(payload.get("title")),
            "subtitle": _s(payload.get("subtitle")),
            "season": _s(payload.get("season")),
            "duration": _s(payload.get("duration")),
            "difficulty": _s(payload.get("difficulty")),
            "location": _s(payload.get("location")),
            "cta_label": _s(payload.get("cta_label")) or "Book This Trek",
            "cta_link": _s(payload.get("cta_link")),
        },
    )

    image_path = payload.get("image_path")
    if image_path:
        _set_filefield_from_path(hero, "image", image_path)
        hero.save(update_fields=["image"])


def replace_overview(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    overview, _ = TrekOverview.objects.get_or_create(trek=trek)
    TrekOverviewSection.objects.filter(overview=overview).delete()

    for s in (payload.get("sections") or []):
        section = TrekOverviewSection.objects.create(
            overview=overview,
            heading=_s(s.get("heading")),
            articles=s.get("articles") or [],
            order=_int(s.get("order"), 0) or 0,
        )
        for b in (s.get("bullets") or []):
            TrekOverviewBullet.objects.create(
                section=section,
                text=_s(_require(b.get("text"), "overview.sections[].bullets[].text")),
                icon=_s(b.get("icon")) or None,
                order=_int(b.get("order"), 0) or 0,
            )


def replace_itinerary(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    TrekItineraryDay.objects.filter(trek=trek).delete()

    for d in (items or []):
        TrekItineraryDay.objects.create(
            trek=trek,
            day=_int(_require(d.get("day"), "itinerary_days[].day")),
            title=_s(_require(d.get("title"), "itinerary_days[].title")),
            description=_s(d.get("description")) or None,
            accommodation=_s(d.get("accommodation")) or None,
            altitude=_s(d.get("altitude")) or None,
            duration=_s(d.get("duration")) or None,
            distance=_s(d.get("distance")) or None,
            meals=_s(d.get("meals")) or None,
            place_name=_s(d.get("place_name")),
            latitude=d.get("latitude"),
            longitude=d.get("longitude"),
        )


def replace_highlights(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    TrekHighlight.objects.filter(trek=trek).delete()

    for h in (items or []):
        TrekHighlight.objects.create(
            trek=trek,
            title=_s(_require(h.get("title"), "highlights[].title")),
            description=_s(_require(h.get("description"), "highlights[].description")),
            icon=_s(_require(h.get("icon"), "highlights[].icon")),  # must be valid choice value
        )


def upsert_action(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    action, _ = TrekAction.objects.update_or_create(trek=trek, defaults={})

    pdf_path = payload.get("pdf_path")
    if pdf_path:
        _set_filefield_from_path(action, "pdf", pdf_path)

    map_path = payload.get("map_image_path")
    if map_path:
        _set_filefield_from_path(action, "map_image", map_path)

    route_geojson_path = payload.get("route_geojson_path")
    if route_geojson_path:
        _set_filefield_from_path(action, "route_geojson", route_geojson_path)

    action.save()


def upsert_cost(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    Cost.objects.update_or_create(
        trek=trek,
        defaults={
            "title": _s(payload.get("title")),
            "cost_inclusions": payload.get("cost_inclusions") or [],
            "cost_exclusions": payload.get("cost_exclusions") or [],
        },
    )


def upsert_cost_and_date_section(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    TrekCostAndDateSection.objects.update_or_create(
        trek=trek,
        defaults={
            "intro_text": _s(payload.get("intro_text")) or TrekCostAndDateSection._meta.get_field("intro_text").default
        },
    )


def replace_departures(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    TrekDeparture.objects.filter(trek=trek).delete()

    for d in (items or []):
        TrekDeparture.objects.create(
            trek=trek,
            start=_require(d.get("start"), "departures[].start"),
            end=_require(d.get("end"), "departures[].end"),
            status=_s(d.get("status")) or TrekDeparture.Status.GUARANTEED,
            price=_require(d.get("price"), "departures[].price"),
            seats_left=_int(d.get("seats_left"), 0) or 0,
        )


def replace_group_prices(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    TrekGroupPrice.objects.filter(trek=trek).delete()

    for gp in (items or []):
        TrekGroupPrice.objects.create(
            trek=trek,
            label=_s(_require(gp.get("label"), "group_prices[].label")),
            price=_require(gp.get("price"), "group_prices[].price"),
        )


def replace_date_highlights(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    TrekDateHighlight.objects.filter(trek=trek).delete()

    for dh in (items or []):
        TrekDateHighlight.objects.create(
            trek=trek,
            highlight=_s(_require(dh.get("highlight"), "date_highlights[].highlight")),
        )


def replace_faqs(trek: TrekInfo, categories: List[Dict[str, Any]]) -> None:
    TrekFAQCategory.objects.filter(trek=trek).delete()

    for c in (categories or []):
        cat = TrekFAQCategory.objects.create(
            trek=trek,
            title=_s(_require(c.get("title"), "faq_categories[].title")),
            icon=_s(c.get("icon")) or TrekFAQCategory.Icons.GENERAL,
            order=_int(c.get("order"), 0) or 0,
        )

        for q in (c.get("questions") or []):
            TrekFAQ.objects.create(
                category=cat,
                question=_s(_require(q.get("question"), "faq_categories[].questions[].question")),
                answer=_s(_require(q.get("answer"), "faq_categories[].questions[].answer")),
                order=_int(q.get("order"), 0) or 0,
            )


def replace_gallery(trek: TrekInfo, images: List[Dict[str, Any]]) -> None:
    TrekGalleryImage.objects.filter(trek=trek).delete()

    for g in (images or []):
        image_path = _require(g.get("image_path"), "gallery_images[].image_path")

        img = TrekGalleryImage.objects.create(
            trek=trek,
            # image is required; create with a dummy name then override
            image="trek_gallery/_import_placeholder.jpg",
            title=_s(g.get("title")),
            caption=_s(g.get("caption")),
            order=_int(g.get("order"), 0) or 0,
        )

        _set_filefield_from_path(img, "image", image_path)
        img.save(update_fields=["image"])


def upsert_elevation_chart(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    chart, _ = TrekElevationChart.objects.update_or_create(
        trek=trek,
        defaults={
            "title": _s(payload.get("title")) or "Elevation Chart",
            "subtitle": _s(payload.get("subtitle")),
        },
    )

    bg_path = payload.get("background_image_path")
    if bg_path:
        _set_filefield_from_path(chart, "background_image", bg_path)
        chart.save(update_fields=["background_image"])

    TrekElevationPoint.objects.filter(chart=chart).delete()

    for p in (payload.get("points") or []):
        TrekElevationPoint.objects.create(
            chart=chart,
            day=_int(_require(p.get("day"), "elevation_chart.points[].day")),
            title=_s(_require(p.get("title"), "elevation_chart.points[].title")),
            elevation=_int(_require(p.get("elevation"), "elevation_chart.points[].elevation")),
            description=_s(p.get("description")),
            order=_int(p.get("order"), 0) or 0,
        )


def upsert_booking_card(trek: TrekInfo, payload: Dict[str, Any]) -> None:
    if not payload:
        return

    card, _ = TrekBookingCard.objects.update_or_create(
        trek=trek,
        defaults={
            "base_price": _require(payload.get("base_price"), "booking_card.base_price"),
            "original_price": payload.get("original_price"),
            "pricing_mode": _s(payload.get("pricing_mode")) or "base_only",
            "badge_label": _s(payload.get("badge_label")) or None,
            "secure_payment": _bool(payload.get("secure_payment"), False),
            "no_hidden_fees": _bool(payload.get("no_hidden_fees"), False),
            "free_cancellation": _bool(payload.get("free_cancellation"), False),
            "support_24_7": _bool(payload.get("support_24_7"), False),
            "trusted_reviews": _bool(payload.get("trusted_reviews"), False),
        },
    )

    TrekBookingGroupPrice.objects.filter(booking=card).delete()

    for gp in (payload.get("group_prices") or []):
        TrekBookingGroupPrice.objects.create(
            booking=card,  # ✅ correct FK name in your model
            min_size=_int(gp.get("min_size")),
            max_size=_int(gp.get("max_size")),
            price=_require(gp.get("price"), "booking_card.group_prices[].price"),
        )


def replace_additional_info(trek: TrekInfo, sections: List[Dict[str, Any]]) -> None:
    TrekAdditionalInfoSection.objects.filter(trek=trek).delete()

    for s in (sections or []):
        sec = TrekAdditionalInfoSection.objects.create(
            trek=trek,
            heading=_s(s.get("heading")),
            articles=s.get("articles") or [],
            order=_int(s.get("order"), 0) or 0,
        )

        for b in (s.get("bullets") or []):
            TrekAdditionalInfoBullet.objects.create(
                section=sec,
                text=_s(_require(b.get("text"), "additional_info_sections[].bullets[].text")),
                icon=_s(b.get("icon")) or None,
                order=_int(b.get("order"), 0) or 0,
            )


def replace_similar_treks(trek: TrekInfo, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Missing related treks are warnings (non-fatal).
    """
    SimilarTrek.objects.filter(trek=trek).delete()

    warnings: List[Dict[str, Any]] = []
    for s in (items or []):
        related_slug = _s(_require(s.get("related_slug"), "similar_treks[].related_slug"))
        order = _int(s.get("order"), 0) or 0

        related = TrekInfo.objects.filter(slug=related_slug).first()
        if not related:
            warnings.append({
                "type": "similar_trek",
                "trek": trek.slug,
                "related_slug": related_slug,
                "warning": "Related trek not found; skipped.",
            })
            continue

        SimilarTrek.objects.create(trek=trek, related_trek=related, order=order)

    return warnings


def replace_reviews(trek: TrekInfo, items: List[Dict[str, Any]]) -> None:
    """
    Replace TrekReview items for a trek.

    Your signals will automatically sync TrekInfo.rating and TrekInfo.reviews
    based on published reviews.
    """
    TrekReview.objects.filter(trek=trek).delete()

    for r in (items or []):
        review = TrekReview.objects.create(
            trek=trek,
            reviewer_name=_s(_require(r.get("reviewer_name"), "reviews_list[].reviewer_name")),
            reviewer_country=_s(r.get("reviewer_country")),
            rating=_int(r.get("rating"), 5) or 5,
            title=_s(r.get("title")),
            body=_s(_require(r.get("body"), "reviews_list[].body")),
            source=_s(r.get("source")) or "internal",
            is_published=_bool(r.get("is_published"), True),
        )

        avatar_path = r.get("reviewer_avatar_path")
        if avatar_path:
            _set_filefield_from_path(review, "reviewer_avatar", avatar_path)
            review.save(update_fields=["reviewer_avatar"])


# -------------------------------------------------------
# Main entry: full import
# -------------------------------------------------------

def import_full_payload(payload: Dict[str, Any], actor: Any = None) -> Dict[str, Any]:
    """
    Full import:
    - Upsert Regions first
    - Upsert Treks
    - Replace all nested sections (CMS-style import)
    - Atomic per trek (no partial trek save)
    """

    regions_payload = payload.get("regions", [])
    treks_payload = payload.get("treks", [])

    if regions_payload is not None and not isinstance(regions_payload, list):
        return {"ok": False, "error": "`regions` must be a list"}
    if treks_payload is None or not isinstance(treks_payload, list):
        return {"ok": False, "error": "`treks` must be a list"}

    meta = payload.get("meta") or {}
    schema_version = _s(meta.get("schema_version")) or "1.0"
    mode = _s(meta.get("mode")) or "replace_nested"

    stats = ImportStats()
    errors: List[Dict[str, Any]] = []
    warnings: List[Dict[str, Any]] = []

    # 1) Regions
    region_map: Dict[str, Region] = {}
    for idx, r in enumerate(regions_payload or []):
        try:
            region = upsert_region(r)
            region_map[region.slug] = region
            stats.regions_upserted += 1
        except Exception as e:
            errors.append({"type": "region", "index": idx, "slug": r.get("slug"), "error": str(e)})

    # 2) Treks (atomic per trek)
    for idx, t in enumerate(treks_payload):
        try:
            with transaction.atomic():
                trek, created = upsert_trek(t, region_map)
                if created:
                    stats.treks_created += 1
                else:
                    stats.treks_updated += 1

                upsert_hero_section(trek, t.get("hero_section") or {})
                if t.get("hero_section"):
                    stats.hero_upserted += 1

                replace_overview(trek, t.get("overview") or {})
                if t.get("overview"):
                    stats.overview_replaced += 1

                replace_itinerary(trek, t.get("itinerary_days") or [])
                if t.get("itinerary_days"):
                    stats.itinerary_replaced += 1

                replace_highlights(trek, t.get("highlights") or [])
                if t.get("highlights"):
                    stats.highlights_replaced += 1

                upsert_action(trek, t.get("action") or {})
                if t.get("action"):
                    stats.action_upserted += 1

                upsert_cost(trek, t.get("cost") or {})
                if t.get("cost"):
                    stats.cost_upserted += 1

                upsert_cost_and_date_section(trek, t.get("cost_and_date_section") or {})
                if t.get("cost_and_date_section"):
                    stats.cost_date_section_upserted += 1

                replace_departures(trek, t.get("departures") or [])
                if t.get("departures"):
                    stats.departures_replaced += 1

                replace_group_prices(trek, t.get("group_prices") or [])
                if t.get("group_prices"):
                    stats.group_prices_replaced += 1

                replace_date_highlights(trek, t.get("date_highlights") or [])
                if t.get("date_highlights"):
                    stats.date_highlights_replaced += 1

                replace_faqs(trek, t.get("faq_categories") or [])
                if t.get("faq_categories"):
                    stats.faq_replaced += 1

                replace_gallery(trek, t.get("gallery_images") or [])
                if t.get("gallery_images"):
                    stats.gallery_replaced += 1

                upsert_elevation_chart(trek, t.get("elevation_chart") or {})
                if t.get("elevation_chart"):
                    stats.elevation_upserted += 1
                    stats.elevation_points_replaced += 1

                upsert_booking_card(trek, t.get("booking_card") or {})
                if t.get("booking_card"):
                    stats.booking_card_upserted += 1
                    stats.booking_group_prices_replaced += 1

                replace_additional_info(trek, t.get("additional_info_sections") or [])
                if t.get("additional_info_sections"):
                    stats.additional_info_replaced += 1

                warnings.extend(replace_similar_treks(trek, t.get("similar_treks") or []))
                if t.get("similar_treks"):
                    stats.similar_treks_replaced += 1

                replace_reviews(trek, t.get("reviews_list") or [])
                if t.get("reviews_list"):
                    stats.reviews_replaced += 1

        except Exception as e:
            errors.append({"type": "trek", "index": idx, "slug": t.get("slug"), "error": str(e)})

    return {
        "ok": len(errors) == 0,
        "meta": {"schema_version": schema_version, "mode": mode},
        "stats": asdict(stats),
        "warnings": warnings,
        "errors": errors,
    }
