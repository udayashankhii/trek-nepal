from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from admin_api.permissions import IsStaff
from admin_api.serializers.customize_trip import (
    CustomizeTripRequestAdminDetailSerializer,
    CustomizeTripRequestAdminListSerializer,
)
from customize_trip.models import CustomizeTripRequest


class CustomizeTripAdminViewSet(ModelViewSet):
    queryset = CustomizeTripRequest.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "request_ref",
        "trip_name",
        "contact_name",
        "contact_email",
        "contact_phone",
    ]
    ordering_fields = ["created_at", "status", "trip_name"]
    ordering = ["-created_at"]
    lookup_field = "request_ref"
    lookup_url_kwarg = "request_ref"

    def get_serializer_class(self):
        if self.action == "list":
            return CustomizeTripRequestAdminListSerializer
        return CustomizeTripRequestAdminDetailSerializer
