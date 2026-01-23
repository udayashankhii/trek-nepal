from rest_framework import serializers

from tours.serializers import TourListSerializer
from travel_styles.models import TravelStyle, TravelStyleTour


class TravelStylePublicSerializer(serializers.ModelSerializer):
    tour_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = TravelStyle
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "hero_image_url",
            "icon",
            "accent_color",
            "metadata",
            "is_published",
            "order",
            "created_at",
            "updated_at",
            "tour_count",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "tour_count"]


class TravelStyleTourPublicSerializer(serializers.ModelSerializer):
    tour = TourListSerializer(read_only=True)

    class Meta:
        model = TravelStyleTour
        fields = ["tour", "order", "is_featured"]
