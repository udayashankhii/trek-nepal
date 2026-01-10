from __future__ import annotations

import json

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from blog.blog.models import BlogPost
from admin_api.permissions import IsStaff
from admin_api.serializers.blog import BlogFullAdminSerializer
from admin_api.services.blog_importer_service import import_blog_posts


class BlogFullImportView(APIView):
    """Bulk import full BlogPost payloads.

    Endpoint:
      - POST /api/admin/blog/import/full/
    """

    permission_classes = [IsAuthenticated, IsStaff]

    def post(self, request, *args, **kwargs):
        incoming = request.data
        upload = request.FILES.get("file")
        if upload is not None:
            try:
                raw = upload.read()
                text = raw.decode("utf-8-sig")
                incoming = json.loads(text)
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

        result = import_blog_posts(incoming if isinstance(incoming, dict) else {"posts": []}, actor=request.user)
        if not result.get("ok"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)


class BlogFullImportDetailView(APIView):
    """Single BlogPost full read/update/delete by slug (+ optional language)."""

    permission_classes = [IsAuthenticated, IsStaff]

    def _language(self, request):
        return request.query_params.get("language") or request.data.get("language") or "en"

    def _normalize_single_payload(self, slug: str, data):
        if not isinstance(data, dict):
            data = {}
        if "posts" in data:
            posts = data.get("posts") or []
        elif "post" in data:
            posts = [data.get("post") or {}]
        else:
            posts = [data]

        if not posts:
            posts = [{}]

        posts[0] = posts[0] or {}
        posts[0]["slug"] = slug
        return {"posts": posts}

    def get(self, request, slug: str, *args, **kwargs):
        language = self._language(request)
        post = BlogPost.objects.filter(slug=slug, language=language).first()
        if not post:
            return Response({"detail": "Blog post not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(BlogFullAdminSerializer(post).data)

    def put(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def patch(self, request, slug: str, *args, **kwargs):
        return self._update(request, slug)

    def _update(self, request, slug: str):
        payload = self._normalize_single_payload(slug, request.data)
        result = import_blog_posts(payload, actor=request.user)
        if not result.get("ok"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        language = self._language(request)
        post = BlogPost.objects.filter(slug=slug, language=language).first()
        if not post:
            return Response({"detail": "Blog post not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"import_result": result, "post": BlogFullAdminSerializer(post).data})

    def delete(self, request, slug: str, *args, **kwargs):
        language = self._language(request)
        post = BlogPost.objects.filter(slug=slug, language=language).first()
        if not post:
            return Response(status=status.HTTP_204_NO_CONTENT)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
