from __future__ import annotations

import json
from typing import Any, Dict, List, Tuple

from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_api.permissions import IsStaff
from admin_api.serializers.travel_styles import (
    TravelStyleAdminDetailSerializer,
    TravelStyleAdminWriteSerializer,
)
from travel_styles.models import TravelStyle


class TravelStyleFullImportView(APIView):
    """Import multiple travel styles from JSON (list or {styles:[...]})"""

    permission_classes = [IsAuthenticated, IsStaff]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    _QUOTE_MAP = str.maketrans(
        {
            "“": '"',
            "”": '"',
            "‘": "'",
            "’": "'",
            "…": "...",
        }
    )

    def _load_json(self, raw: str) -> Any:
        text = raw.translate(self._QUOTE_MAP)
        return json.loads(text)

    def _extract_payload(self, request) -> Tuple[List[Dict[str, Any]], str]:
        if request.FILES:
            upload = request.FILES.get("file")
            if not upload:
                return [], "Upload a file under the 'file' field."
            try:
                payload = self._load_json(upload.read().decode("utf-8"))
            except json.JSONDecodeError:
                return [], "Uploaded file is not valid JSON."
        else:
            payload = request.data

        if isinstance(payload, list):
            return payload, ""

        if isinstance(payload, str):
            try:
                payload = json.loads(payload)
            except json.JSONDecodeError:
                return [], "Invalid JSON payload."

        if isinstance(payload, str):
            try:
                payload = self._load_json(payload)
            except json.JSONDecodeError:
                return [], "Invalid JSON payload."

        if isinstance(payload, dict):
            styles = payload.get("styles")
            if isinstance(styles, list):
                return styles, ""
            if isinstance(styles, str):
                try:
                    decoded = json.loads(styles)
                    if isinstance(decoded, list):
                        return decoded, ""
                except json.JSONDecodeError:
                    pass

        return [], "Payload must be a list or {\"styles\": [...]}."

    def _normalize_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        normalized = dict(item or {})
        if "name" in normalized and not normalized.get("slug"):
            normalized["slug"] = normalized["name"].lower().replace(" ", "-")
        return normalized

    def post(self, request, *args, **kwargs):
        styles, error = self._extract_payload(request)
        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

        created = 0
        updated = 0
        errors: List[Dict[str, Any]] = []

        for idx, item in enumerate(styles):
            if not isinstance(item, dict):
                errors.append({"index": idx, "error": "Each travel style must be an object."})
                continue
            normalized = self._normalize_item(item)
            slug = normalized.get("slug")
            if not slug:
                errors.append({"index": idx, "error": "Missing slug or name."})
                continue

            instance = TravelStyle.objects.filter(slug=slug).first()
            serializer = TravelStyleAdminWriteSerializer(instance=instance, data=normalized)
            if serializer.is_valid():
                serializer.save()
                if instance:
                    updated += 1
                else:
                    created += 1
            else:
                errors.append({"index": idx, "slug": slug, "error": serializer.errors})

        status_code = status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS
        return Response(
            {"created": created, "updated": updated, "failed": len(errors), "errors": errors},
            status=status_code,
        )


class TravelStyleFullImportDetailView(APIView):
    """Single-style upsert/delete by slug using the same format as bulk import."""

    permission_classes = [IsAuthenticated, IsStaff]

    def _ensure_payload(self, slug: str, data: Any) -> Dict[str, Any]:
        payload = dict(data) if isinstance(data, dict) else {}
        payload["slug"] = slug
        return payload

    def get(self, request, slug: str, *args, **kwargs):
        instance = TravelStyle.objects.filter(slug=slug).first()
        if not instance:
            return Response({"detail": "Travel style not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TravelStyleAdminDetailSerializer(instance).data)

    def put(self, request, slug: str, *args, **kwargs):
        return self._upsert(request, slug, partial=False)

    def patch(self, request, slug: str, *args, **kwargs):
        return self._upsert(request, slug, partial=True)

    def _upsert(self, request, slug: str, partial: bool):
        payload = self._ensure_payload(slug, request.data)
        instance = TravelStyle.objects.filter(slug=slug).first()
        serializer = TravelStyleAdminWriteSerializer(instance=instance, data=payload, partial=partial)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(TravelStyleAdminDetailSerializer(serializer.instance).data)

    def delete(self, request, slug: str, *args, **kwargs):
        instance = TravelStyle.objects.filter(slug=slug).first()
        if instance:
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
