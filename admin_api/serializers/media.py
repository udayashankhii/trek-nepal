from __future__ import annotations

from typing import Any

from rest_framework import serializers

from TrekCard.models import TrekGalleryImage, TrekHeroSection
from blog.blog.models import BlogInlineImage, BlogPost
from tours.models import TourGalleryImage, TourHeroImage


class BaseMetadataSerializer(serializers.Serializer):
    caption = serializers.CharField(required=False, allow_blank=True)
    alt_text = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False)

    def validated_metadata(self) -> dict[str, Any]:
        return {
            "caption": self.validated_data.get("caption", ""),
            "alt_text": self.validated_data.get("alt_text", ""),
            "order": self.validated_data.get("order"),
        }


class TrekHeroUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekHeroSection
        fields = ["image", "image_alt", "image_caption"]


class TrekGalleryUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrekGalleryImage
        fields = ["image", "caption", "alt_text", "order"]


class BlogThumbnailUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ["image_file", "image_alt"]


class BlogFeaturedUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "featured_image_file",
            "featured_image_alt",
            "featured_image_caption",
            "featured_image_credit",
        ]


class BlogInlineImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogInlineImage
        fields = ["image", "alt_text", "caption", "block_id", "order"]


class TourHeroUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourHeroImage
        fields = ["image", "alt_text", "caption", "credit"]


class TourGalleryUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourGalleryImage
        fields = ["image", "caption", "alt_text", "order"]


class TrekGalleryMetadataSerializer(BaseMetadataSerializer):
    image_index = serializers.IntegerField(required=False)


class BlogInlineMetadataSerializer(BaseMetadataSerializer):
    block_id = serializers.CharField(required=False, allow_blank=True)


class TourGalleryMetadataSerializer(BaseMetadataSerializer):
    pass
