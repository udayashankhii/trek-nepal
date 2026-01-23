from __future__ import annotations

from typing import Any, Dict

from django.db import transaction

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from tours.models import Tour
from admin_api.permissions import IsStaff
from admin_api.serializers.tour import TourAdminSerializer, TourFullAdminSerializer
from admin_api.services.tour_importer_service import import_tours_payload


def tour_full_queryset():
    return (
        Tour.objects.select_related("overview", "cost", "seo")
        .prefetch_related(
            "itinerary_days",
            "highlight_items",
            "additional_info_sections",
            "group_prices",
            "gallery_images",
            "internal_links",
            "backlinks",
            "similar_tours__related_tour",
            "reviews",
        )
    )


class TourAdminViewSet(ModelViewSet):
    """Admin CRUD for Tours + FULL (nested) read/update/delete by slug."""

    queryset = tour_full_queryset()
    serializer_class = TourAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]

    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = ["title", "slug", "location", "duration", "activity", "travel_style"]
    ordering_fields = ["created_at", "updated_at", "title", "slug"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if getattr(self, "action", None) == "full":
            return TourFullAdminSerializer
        return TourAdminSerializer

    def _build_single_tour_import_payload(self, tour_slug: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            data = {}
        if "tours" in data:
            payload = data
        elif "tour" in data:
            payload = {"meta": data.get("meta") or {}, "tours": [data.get("tour") or {}]}
        else:
            payload = {"meta": {"mode": "replace_nested", "schema_version": "1.0"}, "tours": [data]}

        payload.setdefault("meta", {})
        payload["tours"] = payload.get("tours") or [{}]
        payload["tours"][0] = payload["tours"][0] or {}
        payload["tours"][0]["slug"] = tour_slug
        return payload

    @action(detail=True, methods=["get", "put", "patch", "delete"], url_path="full")
    def full(self, request, slug=None):
        tour: Tour = self.get_object()

        if request.method.lower() == "get":
            serializer = TourFullAdminSerializer(tour, context={"request": request})
            return Response(serializer.data)

        if request.method.lower() == "delete":
            tour.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        incoming = request.data if isinstance(request.data, dict) else {}
        payload = self._build_single_tour_import_payload(tour.slug, incoming)

        with transaction.atomic():
            result = import_tours_payload(payload, actor=getattr(request, "user", None))

        if result.get("ok"):
            refreshed = tour_full_queryset().filter(slug=tour.slug).first()
            full_ser = TourFullAdminSerializer(refreshed, context={"request": request})
            return Response({"import_result": result, "tour": full_ser.data}, status=status.HTTP_200_OK)

        return Response({"import_result": result}, status=status.HTTP_400_BAD_REQUEST)
