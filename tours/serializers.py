from rest_framework import serializers

from travel_styles.models import TravelStyle

<<<<<<< Updated upstream
from .models import (
=======
from TrekCard.models import TrekInfo
from .models import (
    HomeFeaturedTour,
>>>>>>> Stashed changes
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
class TravelStyleSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelStyle
        fields = ["slug", "name"]


class TourListSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="image_url", read_only=True)
    reviews = serializers.IntegerField(source="reviews_count", read_only=True)
    groupSize = serializers.IntegerField(source="group_size", read_only=True)
    travelStyle = serializers.CharField(source="travel_style", read_only=True)
    basePrice = serializers.DecimalField(source="base_price", max_digits=10, decimal_places=2, read_only=True)
    originalPrice = serializers.DecimalField(source="original_price", max_digits=10, decimal_places=2, read_only=True)
    oldPrice = serializers.DecimalField(source="old_price", max_digits=10, decimal_places=2, read_only=True)
    primaryStyle = TravelStyleSummarySerializer(source="primary_style", read_only=True)
    travelStyles = TravelStyleSummarySerializer(many=True, source="travel_styles", read_only=True)

    class Meta:
        model = Tour
        fields = [
            "public_id",
            "title",
            "slug",
            "location",
            "tagline",
            "image_url",
            "image",
            "duration",
            "group_size",
            "groupSize",
            "rating",
            "reviews_count",
            "reviews",
            "price",
            "old_price",
            "oldPrice",
            "base_price",
            "basePrice",
            "original_price",
            "originalPrice",
            "badge",
            "travel_style",
            "travelStyle",
            "primaryStyle",
            "travelStyles",
            "categories",
            "tags",
            "highlights",
        ]


<<<<<<< Updated upstream
=======
class HomeFeaturedTripSerializer(serializers.ModelSerializer):
    entry_type = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    badge = serializers.SerializerMethodField()
    tagline = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    old_price = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = HomeFeaturedTour
        fields = [
            "order",
            "entry_type",
            "title",
            "name",
            "slug",
            "duration",
            "badge",
            "tagline",
            "short_description",
            "price",
            "old_price",
            "rating",
            "reviews_count",
            "image_url",
            "image",
        ]

    def _booking_card(self, trek: TrekInfo):
        return getattr(trek, "booking_card", None)

    def _format_price(self, value):
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return value
        return float(value)

    def _resolve_trek_image(self, trek: TrekInfo):
        hero = getattr(trek, "hero_section", None)
        if hero and getattr(hero, "image", None):
            return hero.image.url if hero.image else None
        card = self._booking_card(trek)
        if card and getattr(card, "image", None):
            return card.image.url
        return None

    def _absolute_url(self, request, url):
        if not url or not request:
            return url
        if url.startswith("http://") or url.startswith("https://"):
            return url
        return request.build_absolute_uri(url)

    def get_entry_type(self, obj):
        if obj.trek_id:
            return "trek"
        return "tour"

    def get_title(self, obj):
        target = obj.trek or obj.tour
        return target.title if target else None

    def get_name(self, obj):
        return self.get_title(obj)

    def get_slug(self, obj):
        target = obj.trek or obj.tour
        return target.slug if target else None

    def get_duration(self, obj):
        if obj.trek:
            return obj.trek.duration
        if obj.tour:
            return obj.tour.duration
        return None

    def get_badge(self, obj):
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and getattr(card, "badge_label", None):
                return card.badge_label
            if obj.trek.trip_grade:
                return obj.trek.trip_grade
            return "Best Trek"
        return obj.tour.badge if obj.tour else None

    def get_tagline(self, obj):
        if obj.tour:
            return obj.tour.tagline
        if obj.trek:
            return obj.trek.trip_grade
        return None

    def get_short_description(self, obj):
        if obj.tour:
            return obj.tour.short_description
        if obj.trek:
            return obj.trek.review_text or obj.trek.trip_grade
        return None

    def get_price(self, obj):
        if obj.tour and obj.tour.price is not None:
            return self._format_price(obj.tour.price)
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and card.base_price is not None:
                return self._format_price(card.base_price)
        return None

    def get_old_price(self, obj):
        if obj.tour and obj.tour.old_price is not None:
            return self._format_price(obj.tour.old_price)
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and card.original_price is not None:
                return self._format_price(card.original_price)
        return None

    def get_rating(self, obj):
        if obj.tour:
            return obj.tour.rating
        if obj.trek:
            return obj.trek.rating
        return None

    def get_reviews_count(self, obj):
        if obj.tour:
            return obj.tour.reviews_count
        if obj.trek:
            return obj.trek.reviews
        return None

    def get_image_url(self, obj):
        request = self.context.get("request")
        url = None
        if obj.tour:
            url = obj.tour.image_url
        elif obj.trek:
            url = self._resolve_trek_image(obj.trek)
        return self._absolute_url(request, url)

    def get_image(self, obj):
        return self.get_image_url(obj)


>>>>>>> Stashed changes
class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = "__all__"


class TourOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourOverview
        fields = ["heading", "paragraphs", "points"]


class TourItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = TourItineraryDay
        fields = ["day", "title", "description", "duration", "distance", "meals"]


class TourHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourHighlight
        fields = ["text", "order"]


class TourCostSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourCost
        fields = ["inclusions", "exclusions"]


class TourAdditionalInfoSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourAdditionalInfoSection
        fields = ["heading", "body", "articles", "bullets", "order"]


class TourGroupPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourGroupPrice
        fields = ["label", "price", "min_size", "max_size", "order"]


class TourGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourGalleryImage
        fields = ["image_url", "caption", "alt_text", "order"]


class TourSEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourSEO
        fields = [
            "meta_title",
            "meta_description",
            "meta_keywords",
            "canonical_url",
            "focus_keyword",
            "og_title",
            "og_description",
            "og_image_url",
            "twitter_title",
            "twitter_description",
            "twitter_image_url",
            "robots_noindex",
            "robots_nofollow",
            "breadcrumbs",
            "structured_data",
        ]


class TourInternalLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourInternalLink
        fields = ["label", "url", "section", "order"]


class TourBacklinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourBacklink
        fields = ["source_name", "url", "anchor_text", "rel", "discovered_at", "is_active"]


class SimilarTourCardSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source="related_tour.slug", read_only=True)
    title = serializers.CharField(source="related_tour.title", read_only=True)
    image_url = serializers.CharField(source="related_tour.image_url", read_only=True)
    duration = serializers.CharField(source="related_tour.duration", read_only=True)
    rating = serializers.FloatField(source="related_tour.rating", read_only=True)
    reviews_count = serializers.IntegerField(source="related_tour.reviews_count", read_only=True)
    price = serializers.DecimalField(source="related_tour.price", max_digits=10, decimal_places=2, read_only=True)
    badge = serializers.CharField(source="related_tour.badge", read_only=True)
    location = serializers.CharField(source="related_tour.location", read_only=True)
    tagline = serializers.CharField(source="related_tour.tagline", read_only=True)

    class Meta:
        model = SimilarTour
        fields = ["slug", "title", "image_url", "duration", "rating", "reviews_count", "price", "badge", "location", "tagline"]


class TourReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourReview
        fields = [
            "author_name",
            "rating",
            "title",
            "body",
            "source_name",
            "source_url",
            "published_at",
        ]


class TourReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourReview
        fields = ["author_name", "rating", "title", "body", "source_name", "source_url", "published_at"]


class TourHeroSerializer(serializers.Serializer):
    title = serializers.CharField()
    subtitle = serializers.CharField(allow_blank=True, required=False)
    image_url = serializers.CharField(allow_blank=True, required=False)
    image = serializers.CharField(allow_blank=True, required=False)
    location = serializers.CharField(allow_blank=True, required=False)
    badge = serializers.CharField(allow_blank=True, required=False)
    duration = serializers.CharField(allow_blank=True, required=False)
    group_size = serializers.IntegerField(allow_null=True, required=False)


class TourKeyInfoSerializer(serializers.Serializer):
    duration = serializers.CharField(allow_blank=True, required=False)
    difficulty = serializers.CharField(allow_blank=True, required=False)
    start_point = serializers.CharField(allow_blank=True, required=False)
    group_size = serializers.IntegerField(allow_null=True, required=False)
    max_altitude = serializers.CharField(allow_blank=True, required=False)
    activity = serializers.CharField(allow_blank=True, required=False)
    rating = serializers.FloatField()
    reviews_count = serializers.IntegerField()


class TourBookingCardSerializer(serializers.Serializer):
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    original_price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    badge = serializers.CharField(allow_blank=True, required=False)
    group_prices = TourGroupPriceSerializer(many=True)
    groupPrices = TourGroupPriceSerializer(many=True)


class TourDetailSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="image_url", read_only=True)
    reviews = serializers.IntegerField(source="reviews_count", read_only=True)
    groupSize = serializers.IntegerField(source="group_size", read_only=True)
    maxAltitude = serializers.CharField(source="max_altitude", read_only=True)
    startPoint = serializers.CharField(source="start_point", read_only=True)
    travelStyle = serializers.CharField(source="travel_style", read_only=True)
    primaryStyle = TravelStyleSummarySerializer(source="primary_style", read_only=True)
    travelStyles = TravelStyleSummarySerializer(many=True, source="travel_styles", read_only=True)
    basePrice = serializers.DecimalField(source="base_price", max_digits=10, decimal_places=2, read_only=True)
    originalPrice = serializers.DecimalField(source="original_price", max_digits=10, decimal_places=2, read_only=True)
    oldPrice = serializers.DecimalField(source="old_price", max_digits=10, decimal_places=2, read_only=True)
    longDescription = serializers.CharField(source="long_description", read_only=True)
    shortDescription = serializers.CharField(source="short_description", read_only=True)
    gallery = serializers.SerializerMethodField()
    itineraryDays = TourItineraryDaySerializer(many=True, source="itinerary_days", read_only=True)
    additionalInfo = TourAdditionalInfoSectionSerializer(many=True, source="additional_info_sections", read_only=True)
    groupPrices = TourGroupPriceSerializer(many=True, source="group_prices", read_only=True)

    overview = TourOverviewSerializer(read_only=True)
    itinerary_days = TourItineraryDaySerializer(many=True, read_only=True)
    highlight_items = TourHighlightSerializer(many=True, read_only=True)
    cost = TourCostSerializer(read_only=True)
    additional_info_sections = TourAdditionalInfoSectionSerializer(many=True, read_only=True)
    group_prices = TourGroupPriceSerializer(many=True, read_only=True)
    gallery_images = TourGalleryImageSerializer(many=True, read_only=True)
    seo = TourSEOSerializer(read_only=True)
    internal_links = TourInternalLinkSerializer(many=True, read_only=True)
    backlinks = TourBacklinkSerializer(many=True, read_only=True)
    similar_tours = SimilarTourCardSerializer(many=True, read_only=True)
    reviews_list = TourReviewSerializer(many=True, source="reviews", read_only=True)

    class Meta:
        model = Tour
        fields = [
            "public_id",
            "title",
            "slug",
            "location",
            "tagline",
            "short_description",
            "shortDescription",
            "long_description",
            "longDescription",
            "image_url",
            "image",
            "duration",
            "group_size",
            "groupSize",
            "difficulty",
            "start_point",
            "startPoint",
            "max_altitude",
            "maxAltitude",
            "activity",
            "travel_style",
            "travelStyle",
            "primaryStyle",
            "travelStyles",
            "badge",
            "rating",
            "reviews_count",
            "reviews",
            "price",
            "old_price",
            "oldPrice",
            "base_price",
            "basePrice",
            "original_price",
            "originalPrice",
            "tags",
            "categories",
            "highlights",
            "overview",
            "itinerary_days",
            "itineraryDays",
            "highlight_items",
            "cost",
            "additional_info_sections",
            "additionalInfo",
            "group_prices",
            "groupPrices",
            "gallery_images",
            "gallery",
            "seo",
            "internal_links",
            "backlinks",
            "similar_tours",
            "reviews_list",
        ]

    def get_gallery(self, obj):
        return [img.image_url for img in obj.gallery_images.all()]
