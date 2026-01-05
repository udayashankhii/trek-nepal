# TrekCard/serializers.py
from __future__ import annotations

import re
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, Optional

from rest_framework import serializers

from .models import (
    Region,TrekInfo, TrekOverview, TrekOverviewSection, TrekOverviewBullet,
    TrekItineraryDay, TrekHighlight, TrekAction, Cost,
    TrekDeparture, TrekGroupPrice, TrekDateHighlight, TrekCostAndDateSection,
    TrekFAQCategory, TrekFAQ, TrekGalleryImage, TrekHeroSection,
    TrekElevationChart, TrekElevationPoint, TrekBookingCard, TrekBookingGroupPrice,
    TrekAdditionalInfoSection, TrekAdditionalInfoBullet,
    BookingIntent, SimilarTrek, TrekReview,
)

# -------------------------------------------------------
# Helpers
# -------------------------------------------------------

def abs_url(request, f) -> Optional[str]:
    """Return absolute URL for FileField/ImageField."""
    if not f or not hasattr(f, "url"):
        return None
    return request.build_absolute_uri(f.url) if request else f.url


class NavTrekMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekInfo
        fields = ["title", "slug"]

class NavRegionWithTreksSerializer(serializers.ModelSerializer):
    treks = NavTrekMiniSerializer(many=True, read_only=True)
    treks_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Region
        fields = ["name", "slug", "treks_count", "treks"]


class RegionSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    treks_count = serializers.IntegerField(read_only=True) 

    class Meta:
        model = Region
        fields = [
            "name",
            "slug",
            "short_label",
            "order",
            "marker_x",
            "marker_y",
            "cover_url",
            "treks_count",   
        ]

    def get_cover_url(self, obj):
        request = self.context.get("request")
        if obj.cover and hasattr(obj.cover, "url"):
            return request.build_absolute_uri(obj.cover.url) if request else obj.cover.url
        return None



# -------------------------------------------------------
# Overview
# -------------------------------------------------------

class TrekOverviewBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekOverviewBullet
        fields = ["id", "text", "icon", "order"]


class TrekOverviewSectionSerializer(serializers.ModelSerializer):
    bullets = TrekOverviewBulletSerializer(many=True, read_only=True)

    class Meta:
        model = TrekOverviewSection
        fields = ["id", "heading", "articles", "order", "bullets"]


class TrekOverviewSerializer(serializers.ModelSerializer):
    sections = TrekOverviewSectionSerializer(many=True, read_only=True)

    class Meta:
        model = TrekOverview
        fields = ["id", "trek", "sections"]


# -------------------------------------------------------
# Core Trek (Key Info)
# -------------------------------------------------------

class TrekAdditionalInfoSectionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekAdditionalInfoSection
        fields = ["id", "heading", "order"]


class TrekInfoSerializer(serializers.ModelSerializer):
    public_id = serializers.UUIDField(read_only=True)
    region = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    region_name = serializers.CharField(source="region.name", read_only=True)
    card_image_url = serializers.SerializerMethodField()  # ← field for hero image

    class Meta:
        model = TrekInfo
        fields = [
            "public_id", "slug", "title",
            "region", "region_name",
            "duration", "trip_grade", "start_point",
            "group_size", "max_altitude", "activity",
            "rating", "reviews", "review_text",
            "card_image_url",
        ]

    def get_card_image_url(self, obj):
        request = self.context.get("request")
        img = None
        if getattr(obj, "hero_section", None) and obj.hero_section.image:
            img = obj.hero_section.image
        elif getattr(obj, "booking_card", None) and hasattr(obj.booking_card, "image"):
            img = obj.booking_card.image
        if img:
            return request.build_absolute_uri(img.url) if request else img.url
        return None

# -------------------------------------------------------
# Itinerary / Highlights
# -------------------------------------------------------

class TrekItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekItineraryDay
        fields = [
            "day", "title", "description",
            "accommodation", "altitude", "duration",
            "distance", "meals",
        ]


class TrekHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekHighlight
        fields = ["title", "description", "icon"]


# -------------------------------------------------------
# Actions (PDF/Map)
# -------------------------------------------------------

class TrekActionSerializer(serializers.ModelSerializer):
    pdfUrl = serializers.SerializerMethodField()
    mapImage = serializers.SerializerMethodField()

    class Meta:
        model = TrekAction
        fields = ["id", "pdfUrl", "mapImage"]

    def get_pdfUrl(self, obj):
        return abs_url(self.context.get("request"), obj.pdf)

    def get_mapImage(self, obj):
        return abs_url(self.context.get("request"), obj.map_image)


# -------------------------------------------------------
# Cost & Dates (Departures grouped by month)
# -------------------------------------------------------

class CostSerializer(serializers.ModelSerializer):
    inclusions = serializers.ListField(source="cost_inclusions")
    exclusions = serializers.ListField(source="cost_exclusions")

    class Meta:
        model = Cost
        fields = ["id", "title", "inclusions", "exclusions"]


class TrekDepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekDeparture
        fields = ["id", "start", "end", "status", "price", "seats_left"]


class TrekGroupPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekGroupPrice
        fields = ["label", "price"]


class TrekDateHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekDateHighlight
        fields = ["highlight"]


class TrekCostAndDateSectionSerializer(serializers.ModelSerializer):
    departures_by_month = serializers.SerializerMethodField()
    groupPrices = serializers.SerializerMethodField()
    highlights = serializers.SerializerMethodField()

    class Meta:
        model = TrekCostAndDateSection
        fields = ["intro_text", "departures_by_month", "groupPrices", "highlights"]

    def get_departures_by_month(self, obj):
        """
        Returns:
        [
          {"month": "May 2026", "departures": [ ... ]},
          ...
        ]
        """
        qs = obj.trek.departures.all().order_by("start")
        grouped: Dict[str, list[dict[str, Any]]] = defaultdict(list)
        for dep in qs:
            label = dep.start.strftime("%B %Y")
            grouped[label].append(TrekDepartureSerializer(dep).data)

        def label_key(lbl: str) -> datetime:
            return datetime.strptime(lbl, "%B %Y")

        return [
            {"month": label, "departures": grouped[label]}
            for label in sorted(grouped.keys(), key=label_key)
        ]

    def get_groupPrices(self, obj):
        return TrekGroupPriceSerializer(obj.trek.group_prices.all(), many=True).data

    def get_highlights(self, obj):
        return TrekDateHighlightSerializer(obj.trek.date_highlights.all(), many=True).data


# -------------------------------------------------------
# FAQ / Gallery / Hero
# -------------------------------------------------------

class TrekFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekFAQ
        fields = ["question", "answer", "order"]


class TrekFAQCategorySerializer(serializers.ModelSerializer):
    questions = TrekFAQSerializer(many=True, read_only=True)

    class Meta:
        model = TrekFAQCategory
        fields = ["id", "title", "icon", "order", "questions"]


class TrekGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TrekGalleryImage
        fields = ["id", "image_url", "title", "caption", "order"]

    def get_image_url(self, obj):
        return abs_url(self.context.get("request"), obj.image)


class TrekHeroSectionSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = TrekHeroSection
        fields = [
            "title", "subtitle", "imageUrl", "season",
            "duration", "difficulty", "location",
            "cta_label", "cta_link",
        ]

    def get_imageUrl(self, obj):
        return abs_url(self.context.get("request"), obj.image)


# -------------------------------------------------------
# Elevation Chart
# -------------------------------------------------------

class TrekElevationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekElevationPoint
        fields = ["day", "title", "elevation", "description", "order"]


class TrekElevationChartSerializer(serializers.ModelSerializer):
    points = TrekElevationPointSerializer(many=True, read_only=True)
    background_image_url = serializers.SerializerMethodField()

    class Meta:
        model = TrekElevationChart
        fields = ["title", "subtitle", "background_image_url", "points"]

    def get_background_image_url(self, obj):
        return abs_url(self.context.get("request"), obj.background_image)


# -------------------------------------------------------
# Booking Card
# -------------------------------------------------------

class TrekBookingGroupPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekBookingGroupPrice
        fields = ["min_size", "max_size", "price"]


class TrekBookingCardSerializer(serializers.ModelSerializer):
    group_prices = TrekBookingGroupPriceSerializer(many=True, read_only=True)
    savings_percentage = serializers.SerializerMethodField()

    class Meta:
        model = TrekBookingCard
        fields = [
            "base_price", "original_price", "pricing_mode",
            "savings_percentage", "badge_label",
            "secure_payment", "no_hidden_fees", "free_cancellation",
            "support_24_7", "trusted_reviews",
            "group_prices",
        ]

    def get_savings_percentage(self, obj):
        if (
            obj.pricing_mode == "original_and_save"
            and obj.original_price
            and obj.base_price
            and obj.original_price > obj.base_price
        ):
            return round((obj.original_price - obj.base_price) / obj.original_price * 100)
        return None


# -------------------------------------------------------
# Additional Info
# -------------------------------------------------------

class TrekAdditionalInfoBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekAdditionalInfoBullet
        fields = ["id", "text", "icon", "order"]


class TrekAdditionalInfoSectionSerializer(serializers.ModelSerializer):
    bullets = TrekAdditionalInfoBulletSerializer(many=True, read_only=True)

    class Meta:
        model = TrekAdditionalInfoSection
        fields = ["id", "heading", "articles", "order", "bullets"]


# -------------------------------------------------------
# Booking Intent (UUID-based)
# -------------------------------------------------------

class BookingIntentSerializer(serializers.ModelSerializer):
    trek_slug = serializers.CharField(source="trek.slug", read_only=True)
    trek_title = serializers.CharField(source="trek.title", read_only=True)

    class Meta:
        model = BookingIntent
        fields = [
            "booking_id", "trek_slug", "trek_title",
            "departure", "party_size",
            "price_snapshot", "status", "created_at", "expires_at",
            "email", "phone",
        ]
        read_only_fields = ["booking_id", "trek_slug", "trek_title", "price_snapshot", "status", "created_at", "expires_at"]


# -------------------------------------------------------
# Similar Treks (Card serializer for UI)
# -------------------------------------------------------

def _extract_days(duration_str: str) -> int | None:
    if not duration_str:
        return None
    m = re.search(r"(\d+)", str(duration_str))
    return int(m.group(1)) if m else None


class SimilarTrekCardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    days = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    badge = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = TrekInfo
        fields = ["slug", "title", "image", "days", "rating", "reviews", "price", "badge", "link"]

    def get_image(self, obj):
        hero = getattr(obj, "hero_section", None)
        return abs_url(self.context.get("request"), hero.image) if hero and hero.image else None

    def get_days(self, obj):
        return _extract_days(obj.duration)

    def get_price(self, obj):
        card = getattr(obj, "booking_card", None)
        return str(card.base_price) if card and card.base_price is not None else None

    def get_badge(self, obj):
        card = getattr(obj, "booking_card", None)
        return (card.badge_label or "").upper() if card and card.badge_label else None

    def get_link(self, obj):
        # Frontend route to trek details
        return f"/treks/{obj.slug}"


# -------------------------------------------------------
# Reviews
# -------------------------------------------------------

class TrekReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    name = serializers.CharField(source="reviewer_name")
    country = serializers.CharField(source="reviewer_country")
    # Frontend ReviewCard expects `text`, but model uses `body`
    text = serializers.CharField(source="body", read_only=True)

    class Meta:
        model = TrekReview
        # Keep `body` for backwards compatibility; prefer `text` in the frontend.
        fields = ["id", "name", "country", "rating", "title", "text", "body", "avatar", "created_at"]

    def get_avatar(self, obj):
        return abs_url(self.context.get("request"), obj.reviewer_avatar)


class TrekReviewCreateSerializer(serializers.ModelSerializer):
    """Accepts the same shape your React UI uses."""

    name = serializers.CharField(source="reviewer_name")
    country = serializers.CharField(source="reviewer_country", required=False, allow_blank=True)
    text = serializers.CharField(source="body")
    avatar = serializers.ImageField(source="reviewer_avatar", required=False, allow_null=True)

    class Meta:
        model = TrekReview
        fields = ["name", "country", "rating", "title", "text", "avatar"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, attrs):
        body = (attrs.get("body") or "").strip()
        if len(body) < 20:
            raise serializers.ValidationError({"text": "Please write at least 20 characters."})
        return attrs

# -------------------------------------------------------
# Composed: One-shot Trek Detail (optional aggregate payload)
# -------------------------------------------------------

class TrekDetailSerializer(serializers.Serializer):
    trek = TrekInfoSerializer(read_only=True)
    hero = TrekHeroSectionSerializer(read_only=True)
    overview = TrekOverviewSerializer(read_only=True)
    itinerary = TrekItineraryDaySerializer(many=True, read_only=True)
    highlights = TrekHighlightSerializer(many=True, read_only=True)
    actions = TrekActionSerializer(read_only=True)
    cost = CostSerializer(read_only=True)
    cost_dates = TrekCostAndDateSectionSerializer(read_only=True)
    faq_categories = TrekFAQCategorySerializer(many=True, read_only=True)
    gallery = TrekGalleryImageSerializer(many=True, read_only=True)
    elevation_chart = TrekElevationChartSerializer(read_only=True)
    booking_card = TrekBookingCardSerializer(read_only=True)
    additional_info = TrekAdditionalInfoSectionSerializer(many=True, read_only=True)
    # You can include a `similar` list here if your view sets it:
    # similar = SimilarTrekCardSerializer(many=True, read_only=True)
