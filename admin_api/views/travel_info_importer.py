from __future__ import annotations

import json
from typing import Any, Dict, List, Tuple

from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from travel_info.models import TravelInfoPage

from admin_api.permissions import IsStaff
from admin_api.serializers.travel_info import (
    TravelInfoAdminDetailSerializer,
    TravelInfoAdminWriteSerializer,
)


class TravelInfoPageFullImportView(APIView):
    """Bulk import Travel Info pages."""

    permission_classes = [IsAuthenticated, IsStaff]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _extract_payload(self, request) -> Tuple[List[Dict[str, Any]], str]:
        if request.FILES:
            upload = request.FILES.get("file")
            if not upload:
                return [], "Upload a file under the 'file' field."
            try:
                payload = json.loads(upload.read().decode("utf-8"))
            except json.JSONDecodeError:
                return [], "Uploaded file is not valid JSON."
        else:
            payload = request.data

        if isinstance(payload, list):
            return payload, ""

        if isinstance(payload, dict):
            pages = payload.get("pages")
            if isinstance(pages, list):
                return pages, ""

        return [], "Payload must be a list or a {\"pages\": [...]} object."

    def post(self, request, *args, **kwargs):
        pages, error = self._extract_payload(request)
        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

        created = 0
        updated = 0
        errors: List[Dict[str, Any]] = []

        for index, item in enumerate(pages):
            if not isinstance(item, dict):
                errors.append({"index": index, "error": "Each page must be an object."})
                continue
            slug = item.get("slug")
            if not slug:
                errors.append({"index": index, "error": "Missing slug."})
                continue

            instance = TravelInfoPage.objects.filter(slug=slug).first()
            serializer = TravelInfoAdminWriteSerializer(instance=instance, data=item)
            if serializer.is_valid():
                serializer.save()
                if instance:
                    updated += 1
                else:
                    created += 1
            else:
                errors.append({"index": index, "slug": slug, "error": serializer.errors})

        return Response(
            {"created": created, "updated": updated, "failed": len(errors), "errors": errors},
            status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS,
        )


class TravelInfoPageFullImportDetailView(APIView):
    """Read/update/delete a single Travel Info page by slug."""

    permission_classes = [IsAuthenticated, IsStaff]

    def _ensure_payload(self, slug: str, data) -> Dict[str, Any]:
        if isinstance(data, dict):
            payload = dict(data)
        else:
            payload = {}
        payload["slug"] = slug
        return payload

    def get(self, request, slug: str, *args, **kwargs):
        page = TravelInfoPage.objects.filter(slug=slug).first()
        if not page:
            return Response({"detail": "Travel info page not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TravelInfoAdminDetailSerializer(page).data)

    def put(self, request, slug: str, *args, **kwargs):
        return self._upsert(request, slug, partial=False)

    def patch(self, request, slug: str, *args, **kwargs):
        return self._upsert(request, slug, partial=True)

    def _upsert(self, request, slug: str, partial: bool):
        payload = self._ensure_payload(slug, request.data)
        instance = TravelInfoPage.objects.filter(slug=slug).first()
        serializer = TravelInfoAdminWriteSerializer(instance=instance, data=payload, partial=partial)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(TravelInfoAdminDetailSerializer(serializer.instance).data)

    def delete(self, request, slug: str, *args, **kwargs):
        page = TravelInfoPage.objects.filter(slug=slug).first()
        if not page:
            return Response(status=status.HTTP_204_NO_CONTENT)
        page.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
