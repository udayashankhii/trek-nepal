from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet

from admin_api.permissions import IsStaff
from admin_api.serializers.home import (
    HomeBestTrekListSerializer,
    HomeBestTrekWriteSerializer,
    HomeFeaturedTourListSerializer,
    HomeFeaturedTourWriteSerializer,
)
from TrekCard.models import HomeBestTrek
from tours.models import HomeFeaturedTour


class HomeBestTrekAdminViewSet(ModelViewSet):
    queryset = HomeBestTrek.objects.select_related("trek").all().order_by("order", "trek__title")
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = HomeBestTrekListSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["order", "trek__title"]
    ordering = ["order", "trek__title"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return HomeBestTrekWriteSerializer
        return HomeBestTrekListSerializer


class HomeFeaturedTourAdminViewSet(ModelViewSet):
    queryset = (
        HomeFeaturedTour.objects.select_related("tour", "trek")
        .all()
        .order_by("order")
    )
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = HomeFeaturedTourListSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["order", "tour__title", "trek__title"]
    ordering = ["order"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return HomeFeaturedTourWriteSerializer
        return HomeFeaturedTourListSerializer
