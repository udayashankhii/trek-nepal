from rest_framework import serializers

from travel_styles.models import TravelStyle, TravelStyleTour


class TravelStyleTourAdminSerializer(serializers.ModelSerializer):
    tour_id = serializers.IntegerField(source="tour.id", read_only=True)
    tour_slug = serializers.CharField(source="tour.slug", read_only=True)
    tour_title = serializers.CharField(source="tour.title", read_only=True)
    tour_image_url = serializers.CharField(source="tour.image_url", read_only=True)
    tour_is_published = serializers.BooleanField(source="tour.is_published", read_only=True)

    class Meta:
        model = TravelStyleTour
        fields = [
            "id",
            "tour_id",
            "tour_slug",
            "tour_title",
            "tour_image_url",
            "tour_is_published",
            "order",
            "is_featured",
        ]


class TravelStyleAdminListSerializer(serializers.ModelSerializer):
    tours_count = serializers.IntegerField(read_only=True)
    tours_preview = serializers.SerializerMethodField()

    class Meta:
        model = TravelStyle
        fields = [
            "id",
            "slug",
            "name",
            "description",
            "hero_image_url",
            "icon",
            "accent_color",
            "is_published",
            "order",
            "updated_at",
            "tours_count",
            "tours_preview",
        ]
        read_only_fields = ["id", "updated_at", "tours_count", "tours_preview"]

    def get_tours_preview(self, obj):
        items = obj.travel_style_tours.order_by("order", "id")[:3]
        serializer = TravelStyleTourAdminSerializer(items, many=True)
        return serializer.data


class TravelStyleAdminDetailSerializer(serializers.ModelSerializer):
    tours_count = serializers.IntegerField(read_only=True)
    tours = TravelStyleTourAdminSerializer(
        source="travel_style_tours", many=True, read_only=True
    )

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
            "tours_count",
            "tours",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "tours_count", "tours"]


class TravelStyleAdminWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelStyle
        fields = [
            "name",
            "slug",
            "description",
            "hero_image_url",
            "icon",
            "accent_color",
            "metadata",
            "is_published",
            "order",
        ]


class TravelStyleTourAttachSerializer(serializers.Serializer):
    tour_id = serializers.IntegerField(min_value=1)


class TravelStyleTourOrderItemSerializer(serializers.Serializer):
    tour_id = serializers.IntegerField(min_value=1)
    order = serializers.IntegerField(min_value=0)


class TravelStyleTourReorderSerializer(serializers.Serializer):
    items = serializers.ListSerializer(child=TravelStyleTourOrderItemSerializer())


class TravelStyleTourUpdateSerializer(serializers.Serializer):
    is_featured = serializers.BooleanField()
