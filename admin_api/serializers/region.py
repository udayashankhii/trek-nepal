from rest_framework import serializers
from TrekCard.models import Region


class RegionAdminSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Region
        fields = [
            "id",
            "name",
            "slug",
            "short_label",
            "order",
            "marker_x",
            "marker_y",
            "cover",
            "cover_url",
        ]
        read_only_fields = ["id", "cover_url"]

    def get_cover_url(self, obj):
        try:
            return obj.cover.url if obj.cover else None
        except Exception:
            return None
