from django.db import transaction
from django.db.models import Count, Max

from rest_framework.exceptions import NotFound
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from admin_api.permissions import IsStaff
from admin_api.serializers.travel_styles import (
    TravelStyleAdminDetailSerializer,
    TravelStyleAdminListSerializer,
    TravelStyleAdminWriteSerializer,
    TravelStyleTourAdminSerializer,
    TravelStyleTourAttachSerializer,
    TravelStyleTourReorderSerializer,
    TravelStyleTourUpdateSerializer,
)
from tours.models import Tour
from travel_styles.models import TravelStyle, TravelStyleTour


class TravelStyleAdminViewSet(ModelViewSet):
    queryset = TravelStyle.objects.all().order_by("order", "name")
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name", "slug", "description"]
    ordering_fields = ["order", "updated_at", "name"]
    ordering = ["order", "name"]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return TravelStyleAdminWriteSerializer
        if self.action == "retrieve":
            return TravelStyleAdminDetailSerializer
        return TravelStyleAdminListSerializer

    def get_queryset(self):
        base = (
            TravelStyle.objects.annotate(
                tours_count=Count("travel_style_tours", distinct=True),
            )
            .order_by("order", "name")
            .prefetch_related("travel_style_tours__tour")
        )
        return base

    @action(detail=True, methods=["get", "post"], url_path="tours")
    def tours(self, request, slug=None):
        style = self.get_object()
        if request.method == "GET":
            items = style.travel_style_tours.select_related("tour").order_by("order", "id")
            serializer = TravelStyleTourAdminSerializer(items, many=True)
            return Response(serializer.data)

        serializer = TravelStyleTourAttachSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tour_id = serializer.validated_data["tour_id"]
        tour = Tour.objects.filter(id=tour_id).first()
        if not tour:
            return Response({"detail": "Tour not found."}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            max_order = (
                style.travel_style_tours.aggregate(max_order=Max("order")).get("max_order") or 0
            )
            pivot, created = TravelStyleTour.objects.get_or_create(
                travel_style=style,
                tour=tour,
                defaults={"order": max_order + 1},
            )
            if not created:
                return Response(
                    {"detail": "Tour is already part of this collection."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        response = TravelStyleTourAdminSerializer(pivot)
        return Response(response.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="tours/reorder")
    def reorder_tours(self, request, slug=None):
        style = self.get_object()
        serializer = TravelStyleTourReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            for item in serializer.validated_data["items"]:
                TravelStyleTour.objects.filter(
                    travel_style=style,
                    tour_id=item["tour_id"],
                ).update(order=item["order"])

        return Response({"updated": len(serializer.validated_data["items"])})

    @action(detail=True, methods=["patch", "delete"], url_path="tours/(?P<tour_pk>[^/.]+)")
    def manage_tour(self, request, slug=None, tour_pk=None):
        style = self.get_object()
        try:
            tour_id = int(tour_pk)
        except (TypeError, ValueError):
            raise NotFound("Invalid tour identifier.")

        tour_relation = TravelStyleTour.objects.filter(
            travel_style=style,
            tour_id=tour_id,
        ).select_for_update().first()

        if not tour_relation:
            raise NotFound("Tour not found in this collection.")

        if request.method == "DELETE":
            with transaction.atomic():
                tour_relation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = TravelStyleTourUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            tour_relation.is_featured = serializer.validated_data["is_featured"]
            tour_relation.save(update_fields=["is_featured"])
        response = TravelStyleTourAdminSerializer(tour_relation)
        return Response(response.data)
