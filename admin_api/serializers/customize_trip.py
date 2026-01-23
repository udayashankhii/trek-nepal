from rest_framework import serializers

from customize_trip.models import CustomizeTripRequest


class CustomizeTripRequestAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizeTripRequest
        fields = [
            "request_ref",
            "trip_name",
            "contact_name",
            "contact_email",
            "status",
            "preferred_start_date",
            "duration_days",
            "adults",
            "children",
            "created_at",
        ]


class CustomizeTripRequestAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizeTripRequest
        fields = "__all__"
        read_only_fields = ("public_id", "request_ref", "created_at", "updated_at")
