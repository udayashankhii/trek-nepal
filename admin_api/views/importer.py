# admin_api/views/importer.py
from __future__ import annotations

from typing import Any, Dict

import json

from django.db import transaction

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from TrekCard.models import TrekInfo

from admin_api.permissions import IsStaff
from admin_api.serializers.import_payload import AdminImportPayloadSerializer
from admin_api.serializers.trek import TrekFullAdminSerializer
from admin_api.services.importer_service import import_full_payload
from admin_api.views.trek import trek_full_queryset


class FullImportView(APIView):
    """Bulk import full CMS JSON payload.

    Endpoint:
      - POST /api/admin/import/full/

    Body:
      {
        "meta": {...},
        "regions": [...],
        "treks": [ { ...full trek... }, ... ]
      }
    """
    permission_classes = [IsAuthenticated, IsStaff]

    def post(self, request, *args, **kwargs):
        # Support both raw JSON body and multipart/form-data upload with a .json file
        incoming = request.data
        upload = request.FILES.get("file")
        if upload is not None:
            try:
                raw = upload.read()
                # tolerate UTF-8 BOM if present
                text = raw.decode("utf-8-sig")
                incoming = json.loads(text)
            except json.JSONDecodeError as e:
                return Response(
                    {"detail": f"Invalid JSON file: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception:
                return Response(
                    {"detail": "Invalid JSON file: unable to read file"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = AdminImportPayloadSerializer(data=incoming)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data
        result = import_full_payload(payload, actor=request.user)

        # If any errors exist, return 400 so frontend can show errors
        if not result.get("ok", False):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK)

class FullImportDetailView(APIView):
    """Single-trek FULL read/update/delete by **slug**, using the same import format.

    Endpoints:
      - GET    /api/admin/import/full/<slug>/
      - PUT    /api/admin/import/full/<slug>/
      - PATCH  /api/admin/import/full/<slug>/
      - DELETE /api/admin/import/full/<slug>/

    PUT/PATCH accepts:
      - full import payload (meta/regions/treks)
      - or a single trek dict
      - or { "trek": {...}, "regions": [...], "meta": {...} }

    NOTE: The slug in the URL is the source of truth.
    """
    permission_classes = [IsAuthenticated, IsStaff]

    def _normalize(self, trek_slug: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            data = {}

        if "treks" in data:
            payload = data
        elif "trek" in data:
            payload = {"meta": data.get("meta") or {}, "regions": data.get("regions") or [], "treks": [data.get("trek") or {}]}
        else:
            payload = {"meta": {"mode": "replace_nested", "schema_version": "1.0"}, "regions": [], "treks": [data]}

        payload.setdefault("meta", {})
        payload.setdefault("regions", [])
        payload["treks"] = payload.get("treks") or [{}]
        payload["treks"][0] = payload["treks"][0] or {}
        payload["treks"][0]["slug"] = trek_slug
        return payload

    def get(self, request, slug: str, *args, **kwargs):
        trek = trek_full_queryset().filter(slug=slug).first()
        if not trek:
            return Response({"detail": "Trek not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TrekFullAdminSerializer(trek, context={"request": request}).data)

    def put(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def patch(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def _update(self, request, slug: str):
        trek = TrekInfo.objects.filter(slug=slug).first()
        if not trek:
            return Response({"detail": "Trek not found."}, status=status.HTTP_404_NOT_FOUND)

        payload = self._normalize(slug, request.data if isinstance(request.data, dict) else {})

        with transaction.atomic():
            result = import_full_payload(payload, actor=request.user)

        if not result.get("ok"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        refreshed = trek_full_queryset().filter(slug=slug).first()
        return Response({"import_result": result, "trek": TrekFullAdminSerializer(refreshed, context={"request": request}).data})

    def delete(self, request, slug: str, *args, **kwargs):
        trek = TrekInfo.objects.filter(slug=slug).first()
        if not trek:
            return Response(status=status.HTTP_204_NO_CONTENT)
        trek.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
