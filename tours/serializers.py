from rest_framework import serializers

from travel_styles.models import TravelStyle

from .models import (
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
