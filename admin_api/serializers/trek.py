from rest_framework import serializers

from TrekCard.models import (
    Region,
    TrekInfo,

    TrekHeroSection,

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

    TrekElevationChart,
    TrekElevationPoint,

    TrekBookingCard,
    TrekBookingGroupPrice,

    TrekAdditionalInfoSection,
    TrekAdditionalInfoBullet,

    SimilarTrek,

    TrekReview,
)


# -------------------------
# Small / nested serializers
# -------------------------

class RegionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ["id", "name", "slug"]


class TrekHeroSectionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TrekHeroSection
        fields = [
            "title", "subtitle",
            "image", "image_url",
            "season", "duration", "difficulty", "location",
            "cta_label", "cta_link",
        ]

    def get_image_url(self, obj):
        try:
            return obj.image.url if obj.image else None
        except Exception:
            return None


class TrekOverviewBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekOverviewBullet
        fields = ["text", "icon", "order"]


class TrekOverviewSectionSerializer(serializers.ModelSerializer):
    bullets = TrekOverviewBulletSerializer(many=True, read_only=True)

    class Meta:
        model = TrekOverviewSection
        fields = ["heading", "articles", "order", "bullets"]


class TrekOverviewSerializer(serializers.ModelSerializer):
    sections = TrekOverviewSectionSerializer(many=True, read_only=True)

    class Meta:
        model = TrekOverview
        fields = ["sections"]


class TrekItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekItineraryDay
        fields = [
            "day", "title", "description",
            "accommodation", "altitude", "duration", "distance", "meals",
            "place_name", "latitude", "longitude",
        ]


class TrekHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekHighlight
        fields = ["title", "description", "icon"]


class TrekActionSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField(read_only=True)
    map_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TrekAction
        fields = ["pdf", "pdf_url", "map_image", "map_image_url"]

    def get_pdf_url(self, obj):
        try:
            return obj.pdf.url if obj.pdf else None
        except Exception:
            return None

    def get_map_image_url(self, obj):
        try:
            return obj.map_image.url if obj.map_image else None
        except Exception:
            return None


class CostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cost
        fields = ["title", "cost_inclusions", "cost_exclusions"]


class TrekCostAndDateSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekCostAndDateSection
        fields = ["intro_text"]


class TrekDepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekDeparture
        fields = ["start", "end", "status", "price", "seats_left"]


class TrekGroupPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekGroupPrice
        fields = ["label", "price"]


class TrekDateHighlightSerializer(serializers.ModelSerializer):
    # Your model has only `highlight` (no order)
    class Meta:
        model = TrekDateHighlight
        fields = ["highlight"]


class TrekFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekFAQ
        fields = ["question", "answer", "order"]


class TrekFAQCategorySerializer(serializers.ModelSerializer):
    questions = TrekFAQSerializer(many=True, read_only=True)

    class Meta:
        model = TrekFAQCategory
        fields = ["title", "icon", "order", "questions"]


class TrekGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TrekGalleryImage
        fields = ["image", "image_url", "title", "caption", "order"]

    def get_image_url(self, obj):
        try:
            return obj.image.url if obj.image else None
        except Exception:
            return None


class TrekElevationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekElevationPoint
        fields = ["day", "title", "elevation", "description", "order"]


class TrekElevationChartSerializer(serializers.ModelSerializer):
    background_image_url = serializers.SerializerMethodField(read_only=True)
    points = TrekElevationPointSerializer(many=True, read_only=True)

    class Meta:
        model = TrekElevationChart
        fields = ["title", "subtitle", "background_image", "background_image_url", "points"]

    def get_background_image_url(self, obj):
        try:
            return obj.background_image.url if obj.background_image else None
        except Exception:
            return None


class TrekBookingGroupPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekBookingGroupPrice
        fields = ["min_size", "max_size", "price"]


class TrekBookingCardSerializer(serializers.ModelSerializer):
    group_prices = TrekBookingGroupPriceSerializer(many=True, read_only=True)

    class Meta:
        model = TrekBookingCard
        fields = [
            "base_price", "original_price", "pricing_mode", "badge_label",
            "secure_payment", "no_hidden_fees", "free_cancellation",
            "support_24_7", "trusted_reviews",
            "group_prices",
        ]


class TrekAdditionalInfoBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekAdditionalInfoBullet
        fields = ["text", "icon", "order"]


class TrekAdditionalInfoSectionSerializer(serializers.ModelSerializer):
    bullets = TrekAdditionalInfoBulletSerializer(many=True, read_only=True)

    class Meta:
        model = TrekAdditionalInfoSection
        fields = ["heading", "articles", "order", "bullets"]


class SimilarTrekSerializer(serializers.ModelSerializer):
    related_slug = serializers.CharField(source="related_trek.slug", read_only=True)
    related_title = serializers.CharField(source="related_trek.title", read_only=True)

    class Meta:
        model = SimilarTrek
        fields = ["order", "related_slug", "related_title"]


class TrekReviewSerializer(serializers.ModelSerializer):
    reviewer_avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TrekReview
        fields = [
            "reviewer_name",
            "reviewer_country",
            "reviewer_avatar",
            "reviewer_avatar_url",
            "rating",
            "title",
            "body",
            "source",
            "is_published",
            "created_at",
        ]

    def get_reviewer_avatar_url(self, obj):
        try:
            return obj.reviewer_avatar.url if obj.reviewer_avatar else None
        except Exception:
            return None


# -------------------------
# Admin list/detail serializer
# -------------------------

class TrekAdminSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for admin list/detail + create/update.
    """
    region = RegionMiniSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source="region",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = TrekInfo
        fields = [
            "id", "public_id",
            "title", "slug",
            "duration", "trip_grade", "start_point", "group_size", "max_altitude", "activity",
            "rating", "reviews", "review_text",
            "region", "region_id",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "public_id", "created_at", "updated_at", "rating", "reviews"]


# -------------------------
# Admin list row serializer (compat for frontend table)
# -------------------------


class TrekAdminListRowSerializer(serializers.ModelSerializer):
    """Serializer that matches the Admin Frontend table columns.

    The frontend shows Region / Duration / Price / Status.
    Some of those fields live in related models (Region, BookingCard, Departures).
    We expose simple top-level keys so the UI can render without extra mapping.
    """

    # IMPORTANT:
    # The Admin Frontend typically reads region as an object (e.g. trek.region?.name).
    # So we expose `region` as an object (id, name, slug).
    # Additionally we expose `region_name` + `region_slug` as top-level keys.
    region = RegionMiniSerializer(read_only=True)
    region_name = serializers.CharField(source="region.name", read_only=True)
    region_slug = serializers.CharField(source="region.slug", read_only=True)

    # Keep trip_grade but also expose a "difficulty" alias (many UIs use this key)
    difficulty = serializers.CharField(source="trip_grade", read_only=True)

    # Best-effort price: booking_card.base_price -> first departure.price -> first group_price.price
    price = serializers.SerializerMethodField()
    base_price = serializers.SerializerMethodField()

    # Published/Draft
    is_published = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = TrekInfo
        fields = [
            "id",
            "public_id",
            "title",
            "slug",
            "region",
            "region_name",
            "region_slug",
            "trip_grade",
            "difficulty",
            "duration",
            "price",
            "base_price",
            "is_published",
            "status",
            "rating",
            "reviews",
        ]

    def _best_price(self, obj):
        # 1) booking_card.base_price
        bc = getattr(obj, "booking_card", None)
        if bc is not None:
            bp = getattr(bc, "base_price", None)
            if bp is not None:
                return bp

        # 2) first departure.price
        deps = getattr(obj, "departures", None)
        try:
            if deps is not None:
                first = deps.all().order_by("start").first()
                if first and getattr(first, "price", None) is not None:
                    return first.price
        except Exception:
            pass

        # 3) first group_price.price
        gps = getattr(obj, "group_prices", None)
        try:
            if gps is not None:
                first = gps.all().first()
                if first and getattr(first, "price", None) is not None:
                    return first.price
        except Exception:
            pass

        return None

    def get_price(self, obj):
        return self._best_price(obj)

    def get_base_price(self, obj):
        # provide both keys; many frontends show base_price specifically
        return self._best_price(obj)

    def _is_published(self, obj) -> bool:
        # Try common field names
        for attr in ("is_published", "published", "is_active", "is_public"):
            if hasattr(obj, attr):
                val = getattr(obj, attr)
                if val is not None:
                    return bool(val)

        # Fallback: if there is a hero section, treat as published (better UX in admin list)
        try:
            return bool(getattr(obj, "hero_section_id", None) or getattr(obj, "hero_section", None))
        except Exception:
            return False

    def get_is_published(self, obj):
        return self._is_published(obj)

    def get_status(self, obj):
        return "Published" if self._is_published(obj) else "Draft"


# -------------------------
# Full nested serializer
# -------------------------

class TrekFullAdminSerializer(serializers.ModelSerializer):
    """
    Full nested serializer for:
      GET /api/admin/treks/<id>/full/
    """
    region = RegionMiniSerializer(read_only=True)

    hero_section = TrekHeroSectionSerializer(read_only=True)
    overview = TrekOverviewSerializer(read_only=True)

    itinerary_days = TrekItineraryDaySerializer(many=True, read_only=True)
    highlights = TrekHighlightSerializer(many=True, read_only=True)

    action = TrekActionSerializer(read_only=True)
    cost = CostSerializer(read_only=True)
    cost_and_date_section = TrekCostAndDateSectionSerializer(read_only=True)

    departures = TrekDepartureSerializer(many=True, read_only=True)
    group_prices = TrekGroupPriceSerializer(many=True, read_only=True)
    date_highlights = TrekDateHighlightSerializer(many=True, read_only=True)

    faq_categories = TrekFAQCategorySerializer(many=True, read_only=True)
    gallery_images = TrekGalleryImageSerializer(many=True, read_only=True)

    elevation_chart = TrekElevationChartSerializer(read_only=True)
    booking_card = TrekBookingCardSerializer(read_only=True)

    additional_info_sections = TrekAdditionalInfoSectionSerializer(many=True, read_only=True)
    similar_treks = SimilarTrekSerializer(many=True, read_only=True)

    reviews_list = TrekReviewSerializer(many=True, read_only=True)

    class Meta:
        model = TrekInfo
        fields = [
            "id", "public_id",
            "title", "slug",
            "duration", "trip_grade", "start_point", "group_size", "max_altitude", "activity",
            "rating", "reviews", "review_text",
            "region",

            "hero_section",
            "overview",
            "itinerary_days",
            "highlights",
            "action",
            "cost",
            "cost_and_date_section",
            "departures",
            "group_prices",
            "date_highlights",
            "faq_categories",
            "gallery_images",
            "elevation_chart",
            "booking_card",
            "additional_info_sections",
            "similar_treks",
            "reviews_list",

            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "public_id",
            "title", "slug",
            "duration", "trip_grade", "start_point", "group_size", "max_altitude", "activity",
            "rating", "reviews", "review_text",
            "region",

            "hero_section",
            "overview",
            "itinerary_days",
            "highlights",
            "action",
            "cost",
            "cost_and_date_section",
            "departures",
            "group_prices",
            "date_highlights",
            "faq_categories",
            "gallery_images",
            "elevation_chart",
            "booking_card",
            "additional_info_sections",
            "similar_treks",
            "reviews_list",

            "created_at", "updated_at",
        ]
