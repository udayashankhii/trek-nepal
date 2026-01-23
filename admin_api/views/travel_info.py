from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from admin_api.permissions import IsStaff
from admin_api.serializers.travel_info import (
    TravelInfoAdminDetailSerializer,
    TravelInfoAdminListSerializer,
    TravelInfoAdminWriteSerializer,
)
from travel_info.models import TravelInfoPage


class TravelInfoAdminViewSet(ModelViewSet):
    queryset = TravelInfoPage.objects.all().order_by("order", "title")
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "slug", "summary"]
    ordering_fields = ["updated_at", "order", "title"]
    ordering = ["order", "title"]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return TravelInfoAdminWriteSerializer
        if self.action == "retrieve":
            return TravelInfoAdminDetailSerializer
        return TravelInfoAdminListSerializer
