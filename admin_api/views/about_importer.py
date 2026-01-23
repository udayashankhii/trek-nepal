from __future__ import annotations

import json
from typing import Any, Dict, List, Tuple

from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from about_info.models import AboutPage
from admin_api.permissions import IsStaff
from admin_api.serializers.about_info import AboutPageAdminWriteSerializer


class AboutPageFullImportView(APIView):
    """Bulk import About pages.

    Accepts:
    - JSON body: {"pages": [ ... ]} or [ ... ]
    - multipart file: field name "file"
    """

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
        errors = []

        for index, item in enumerate(pages):
            if not isinstance(item, dict):
                errors.append({"index": index, "error": "Each page must be an object."})
                continue
            slug = item.get("slug")
            if not slug:
                errors.append({"index": index, "error": "Missing slug."})
                continue

            instance = AboutPage.objects.filter(slug=slug).first()
            serializer = AboutPageAdminWriteSerializer(instance=instance, data=item)
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
