from rest_framework import serializers

from .models import CustomizeTripRequest


class _OptionalDateField(serializers.DateField):
    def to_internal_value(self, data):
        if data in ("", None):
            return None
        return super().to_internal_value(data)


class CustomizeTripRequestCreateSerializer(serializers.ModelSerializer):
    preferred_start_date = _OptionalDateField(
        allow_null=True,
        required=False,
    )
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)

    class Meta:
        model = CustomizeTripRequest
        fields = [
            "public_id",
            "request_ref",
            "trip_slug",
            "trip_name",
            "product_type",
            "product_slug",
            "product_name",
            "preferred_region",
            "preferred_start_date",
            "date_flexibility",
            "duration_days",
            "adults",
            "children",
            "private_trip",
            "accommodation",
            "transport",
            "guide_required",
            "porter_preference",
            "add_ons",
            "special_requests",
            "origin_url",
            "source",
            "website",
            "contact_name",
            "contact_email",
            "contact_phone",
            "contact_country",
            "fitness_level",
            "budget",
            "consent_to_contact",
            "status",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "public_id",
            "request_ref",
            "status",
            "metadata",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        if not attrs.get("consent_to_contact"):
            raise serializers.ValidationError(
                {"consent_to_contact": "Consent to be contacted is required."}
            )

        if attrs.get("adults", 0) < 1:
            raise serializers.ValidationError({"adults": "At least 1 adult must be listed."})

        duration = attrs.get("duration_days", 0)
        if duration < 1 or duration > 60:
            raise serializers.ValidationError(
                {"duration_days": "Duration must be between 1 and 60 days."}
            )

        children = attrs.get("children", 0)
        if children < 0 or children > 20:
            raise serializers.ValidationError(
                {"children": "Children must be between 0 and 20."}
            )

        add_ons = attrs.get("add_ons")
        if add_ons is not None and not isinstance(add_ons, (list, tuple)):
            raise serializers.ValidationError({"add_ons": "Add-ons must be a list of strings."})

        return attrs


class CustomizeTripRequestAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizeTripRequest
        fields = "__all__"
