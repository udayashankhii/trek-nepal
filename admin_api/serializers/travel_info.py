from rest_framework import serializers

from travel_info.models import TravelInfoPage


class TravelInfoAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelInfoPage
        fields = [
            "id",
            "slug",
            "title",
            "subtitle",
            "summary",
            "hero_image_url",
            "is_published",
            "order",
            "updated_at",
        ]
        read_only_fields = fields


class TravelInfoAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelInfoPage
        fields = "__all__"


class TravelInfoAdminWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelInfoPage
        fields = [
            "slug",
            "title",
            "subtitle",
            "summary",
            "hero_image_url",
            "highlights",
            "sections",
            "tips",
            "faqs",
            "meta_title",
            "meta_description",
            "meta_keywords",
            "og_image_url",
            "twitter_image_url",
            "last_reviewed",
            "is_published",
            "order",
        ]
