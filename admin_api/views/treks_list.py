# admin_api/views/treks_list.py
from __future__ import annotations

from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from admin_api.permissions import IsStaff
from admin_api.serializers.trek import (
    TrekAdminSerializer,
    TrekAdminListRowSerializer,
    TrekFullAdminSerializer,
)
from admin_api.views.trek import trek_full_queryset


class TreksListView(APIView):
    """Compatibility endpoint for the Admin Frontend.

    Frontend expects:
      GET /api/admin/treks-list/

    Response:
      A plain JSON array (NOT paginated object).
    """
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, *args, **kwargs):
        qs = trek_full_queryset().order_by("-id")

        q = request.query_params.get("search") or request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(title__icontains=q)
                | Q(slug__icontains=q)
                | Q(region__name__icontains=q)
                | Q(region__slug__icontains=q)
                | Q(trip_grade__icontains=q)
                | Q(duration__icontains=q)
            )

        # IMPORTANT: return fields the Admin Frontend table expects
        # (region, duration, price, status) as top-level keys.
        data = TrekAdminListRowSerializer(qs, many=True, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)


class TrekDetailFullView(APIView):
    """Compatibility detail endpoint for the Admin Frontend.

    Useful when frontend wants a dedicated URL to load full trek details on click:
      GET /api/admin/treks-detail/<slug>/

    Response:
      Full nested trek payload using TrekFullAdminSerializer.
    """
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, slug: str, *args, **kwargs):
        trek = get_object_or_404(trek_full_queryset(), slug=slug)
        data = TrekFullAdminSerializer(trek, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, slug: str, *args, **kwargs):
        """Partial update for admin frontend.

        Frontend sends small payloads like:
          {"title": "...", "trip_grade": "..."}
        """
        trek = get_object_or_404(trek_full_queryset(), slug=slug)

        # Use lightweight admin serializer for safe partial updates of top-level fields.
        ser = TrekAdminSerializer(
            trek,
            data=request.data if isinstance(request.data, dict) else {},
            partial=True,
            context={"request": request},
        )
        ser.is_valid(raise_exception=True)
        ser.save()

        # Return FULL payload so details page can refresh immediately.
        refreshed = trek_full_queryset().filter(slug=slug).first()
        data = TrekFullAdminSerializer(refreshed, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, slug: str, *args, **kwargs):
        """Full update for top-level fields.

        NOTE: For nested replace (itinerary, gallery, etc.), use import/full or /treks/<slug>/full/.
        """
        trek = get_object_or_404(trek_full_queryset(), slug=slug)
        ser = TrekAdminSerializer(
            trek,
            data=request.data if isinstance(request.data, dict) else {},
            partial=False,
            context={"request": request},
        )
        ser.is_valid(raise_exception=True)
        ser.save()

        refreshed = trek_full_queryset().filter(slug=slug).first()
        data = TrekFullAdminSerializer(refreshed, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, slug: str, *args, **kwargs):
        trek = get_object_or_404(trek_full_queryset(), slug=slug)
        trek.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
