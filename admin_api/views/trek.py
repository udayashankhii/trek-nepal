# admin_api/views/trek.py
from __future__ import annotations

from typing import Any, Dict

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from TrekCard.models import TrekInfo
from admin_api.permissions import IsStaff
from admin_api.serializers.trek import TrekAdminSerializer, TrekFullAdminSerializer
from admin_api.services.importer_service import import_full_payload


def trek_full_queryset():
    """Optimized queryset for FULL nested trek fetch to avoid N+1 queries."""
    return (
        TrekInfo.objects.select_related(
            "region",
            "hero_section",
            "overview",
            "action",
            "cost",
            "cost_and_date_section",
            "elevation_chart",
            "booking_card",
        )
        .prefetch_related(
            "overview__sections__bullets",
            "itinerary_days",
            "highlights",
            "departures",
            "group_prices",
            "date_highlights",
            "faq_categories__questions",
            "gallery_images",
            "elevation_chart__points",
            "booking_card__group_prices",
            "additional_info_sections__bullets",
            "similar_treks__related_trek",
            "reviews_list",
        )
    )


class TrekAdminViewSet(ModelViewSet):
    """Admin CRUD for Treks + FULL (nested) read/update/delete by **slug**.

    CRUD (lightweight):
      - GET    /api/admin/treks/
      - POST   /api/admin/treks/
      - GET    /api/admin/treks/<slug>/
      - PATCH  /api/admin/treks/<slug>/
      - DELETE /api/admin/treks/<slug>/

    FULL (nested CMS-style replace):
      - GET    /api/admin/treks/<slug>/full/
      - PUT    /api/admin/treks/<slug>/full/
      - PATCH  /api/admin/treks/<slug>/full/
      - DELETE /api/admin/treks/<slug>/full/
    """

    queryset = trek_full_queryset()
    serializer_class = TrekAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]

    # IMPORTANT: use slug everywhere (no numeric IDs in admin panel URLs)
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = [
        "title",
        "slug",
        "region__name",
        "region__slug",
        "trip_grade",
        "duration",
        "start_point",
        "activity",
    ]
    ordering_fields = ["created_at", "updated_at", "title", "slug"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        # Full serializer only for GET /full/
        if getattr(self, "action", None) == "full":
            return TrekFullAdminSerializer
        return TrekAdminSerializer

    def _build_single_trek_import_payload(self, trek_slug: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Accepts either:
        - full import payload: {meta, regions, treks:[...]}
        - a single trek dict
        - or {trek: {...}, regions:[...], meta:{...}}
        and normalizes into import_full_payload() format.
        """
        if not isinstance(data, dict):
            data = {}

        if "treks" in data:
            payload = data
        elif "trek" in data:
            payload = {"meta": data.get("meta") or {}, "regions": data.get("regions") or [], "treks": [data.get("trek") or {}]}
        else:
            payload = {"meta": {"mode": "replace_nested", "schema_version": "1.0"}, "regions": [], "treks": [data]}

        # Force URL slug (single source of truth)
        payload.setdefault("meta", {})
        payload.setdefault("regions", [])
        payload["treks"] = payload.get("treks") or [{}]
        payload["treks"][0] = payload["treks"][0] or {}
        payload["treks"][0]["slug"] = trek_slug
        return payload

    @action(detail=True, methods=["get", "put", "patch", "delete"], url_path="full")
    def full(self, request, slug=None):
        # slug comes from lookup_url_kwarg
        trek: TrekInfo = self.get_object()

        if request.method.lower() == "get":
            serializer = TrekFullAdminSerializer(trek, context={"request": request})
            return Response(serializer.data)

        if request.method.lower() == "delete":
            trek.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # PUT/PATCH => CMS-style replace nested using importer
        incoming = request.data if isinstance(request.data, dict) else {}
        payload = self._build_single_trek_import_payload(trek.slug, incoming)

        # Ensure we import inside a transaction; importer already does per trek atomic,
        # but we keep this for safety and consistent API behavior.
        with transaction.atomic():
            result = import_full_payload(payload, actor=getattr(request, "user", None))

        # Re-fetch and return the FULL updated trek if import ok
        if result.get("ok"):
            refreshed = trek_full_queryset().filter(slug=trek.slug).first()
            full_ser = TrekFullAdminSerializer(refreshed, context={"request": request})
            return Response({"import_result": result, "trek": full_ser.data}, status=status.HTTP_200_OK)

        return Response({"import_result": result}, status=status.HTTP_400_BAD_REQUEST)
