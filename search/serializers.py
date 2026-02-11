from rest_framework import serializers


class SearchResultSerializer(serializers.Serializer):
    """Normalize trek/tour search payloads before returning to the frontend."""

    TYPE_CHOICES = (
        ("trek", "trek"),
        ("tour", "tour"),
    )

    id = serializers.CharField()
    type = serializers.ChoiceField(choices=TYPE_CHOICES)
    slug = serializers.CharField()
    title = serializers.CharField()
    subtitle = serializers.CharField(allow_blank=True, required=False)
    location = serializers.CharField(allow_blank=True, required=False)
    region = serializers.CharField(allow_blank=True, required=False)
    duration = serializers.CharField(allow_blank=True, required=False)
    rating = serializers.FloatField(allow_null=True, required=False)
    price = serializers.FloatField(allow_null=True, required=False)
    image_url = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    meta = serializers.DictField(required=False)
    match_fields = serializers.ListField(child=serializers.CharField(), required=False)
    score = serializers.FloatField()
    region_slug = serializers.CharField(allow_blank=True, required=False)
