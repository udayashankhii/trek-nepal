from rest_framework import serializers

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


class TravelStyleBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelStyle
        fields = ["slug", "name", "hero_image_url", "icon", "accent_color"]


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


class SimilarTourSerializer(serializers.ModelSerializer):
    related_slug = serializers.CharField(source="related_tour.slug", read_only=True)
    related_title = serializers.CharField(source="related_tour.title", read_only=True)

    class Meta:
        model = SimilarTour
        fields = ["related_slug", "related_title", "order"]


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
            "is_published",
        ]


class TourAdminSerializer(serializers.ModelSerializer):
    travel_styles = TravelStyleBriefSerializer(many=True, read_only=True)

    class Meta:
        model = Tour
        fields = "__all__"


class TourFullAdminSerializer(serializers.ModelSerializer):
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
    similar_tours = SimilarTourSerializer(many=True, read_only=True)
    reviews_list = TourReviewSerializer(many=True, source="reviews", read_only=True)

    class Meta:
        model = Tour
        fields = "__all__"
