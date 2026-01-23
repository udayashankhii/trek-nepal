from rest_framework import serializers

from .models import TravelInfoPage


class TravelInfoPageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelInfoPage
        fields = [
            "slug",
            "title",
            "subtitle",
            "summary",
            "hero_image_url",
            "highlights",
            "order",
            "updated_at",
        ]


class TravelInfoPageDetailSerializer(serializers.ModelSerializer):
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
            "updated_at",
        ]
