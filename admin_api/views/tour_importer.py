from __future__ import annotations

import json

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from tours.models import Tour
from admin_api.permissions import IsStaff
from admin_api.serializers.tour import TourFullAdminSerializer
from admin_api.services.tour_importer_service import import_tours_payload


class TourFullImportView(APIView):
    """Bulk import full Tour payloads.

    Endpoint:
      - POST /api/admin/tours/import/full/
    """

    permission_classes = [IsAuthenticated, IsStaff]

    _QUOTE_MAP = str.maketrans(
        {
            "“": '"',
            "”": '"',
            "‘": "'",
            "’": "'",
            "…": "...",
        }
    )

    def _load_json(self, raw: str) -> dict:
        text = raw.translate(self._QUOTE_MAP)
        return json.loads(text)

    def post(self, request, *args, **kwargs):
        incoming = request.data
        upload = request.FILES.get("file")
        if upload is not None:
            try:
                raw = upload.read()
                text = raw.decode("utf-8-sig")
                incoming = self._load_json(text)
            except json.JSONDecodeError as exc:
                return Response(
                    {"detail": f"Invalid JSON file: {str(exc)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception:
                return Response(
                    {"detail": "Invalid JSON file: unable to read file"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        result = import_tours_payload(incoming if isinstance(incoming, dict) else {"tours": []}, actor=request.user)
        if not result.get("ok"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)


class TourFullImportDetailView(APIView):
    """Single Tour full read/update/delete by slug."""

    permission_classes = [IsAuthenticated, IsStaff]

    def _normalize_single_payload(self, slug: str, data):
        if not isinstance(data, dict):
            data = {}
        if "tours" in data:
            tours = data.get("tours") or []
        elif "tour" in data:
            tours = [data.get("tour") or {}]
        else:
            tours = [data]
        if not tours:
            tours = [{}]
        tours[0] = tours[0] or {}
        tours[0]["slug"] = slug
        return {"tours": tours}

    def get(self, request, slug: str, *args, **kwargs):
        tour = Tour.objects.filter(slug=slug).first()
        if not tour:
            return Response({"detail": "Tour not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TourFullAdminSerializer(tour).data)

    def put(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def patch(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def _update(self, request, slug: str):
        payload = self._normalize_single_payload(slug, request.data)
        result = import_tours_payload(payload, actor=request.user)
        if not result.get("ok"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        tour = Tour.objects.filter(slug=slug).first()
        if not tour:
            return Response({"detail": "Tour not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"import_result": result, "tour": TourFullAdminSerializer(tour).data})

    def delete(self, request, slug: str, *args, **kwargs):
        tour = Tour.objects.filter(slug=slug).first()
        if not tour:
            return Response(status=status.HTTP_204_NO_CONTENT)
        tour.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
