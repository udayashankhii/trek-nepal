from rest_framework import serializers


class MetaSerializer(serializers.Serializer):
    schema_version = serializers.CharField(required=False, default="1.0")
    mode = serializers.ChoiceField(required=False, choices=["replace_nested"], default="replace_nested")
    generated_by = serializers.CharField(required=False, allow_blank=True)
    generated_at = serializers.DateTimeField(required=False)


class AdminImportPayloadSerializer(serializers.Serializer):
    """
    Validates the top-level import payload.
    Nested validation is handled by the service (or you can expand later).
    """
    meta = MetaSerializer(required=False)

    regions = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
    )

    treks = serializers.ListField(
        child=serializers.DictField(),
        required=True,
    )

    def validate(self, attrs):
        treks = attrs.get("treks") or []
        if not treks:
            raise serializers.ValidationError({"treks": "At least one trek is required."})
        return attrs
