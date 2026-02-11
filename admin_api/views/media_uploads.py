from __future__ import annotations

import json
from typing import Any, Iterable, Sequence

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from TrekCard.models import TrekGalleryImage, TrekHeroSection, TrekInfo
from admin_api.permissions import IsStaff
from admin_api.serializers.media import (
    BlogFeaturedUploadSerializer,
    BlogInlineImageUploadSerializer,
    BlogThumbnailUploadSerializer,
    TrekGalleryUploadSerializer,
    TrekHeroUploadSerializer,
    TourGalleryUploadSerializer,
    TourHeroUploadSerializer,
)
from blog.blog.models import BlogInlineImage, BlogPost, default_featured_image
from tours.models import Tour, TourGalleryImage, TourHeroImage


def _parse_metadata(raw: Any) -> list[dict[str, Any]]:
    if not raw:
        return []
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return []
    if isinstance(raw, Sequence):
        return list(raw)
    return []


def _absolute_url(request, value: str | None) -> str:
    if not value:
        return ""
    normalized = value.strip()
    if normalized.startswith("http://") or normalized.startswith("https://"):
        return normalized
    return request.build_absolute_uri(normalized)


def _thumbnail_payload(request, post: BlogPost) -> dict[str, str]:
    source = (post.image_file.url if post.image_file else post.image) or ""
    return {
        "url": _absolute_url(request, source),
        "alt_text": post.image_alt or "",
    }


def _ensure_thumbnail_url(post: BlogPost) -> None:
    if post.image_file and post.image != post.image_file.url:
        post.image = post.image_file.url
        post.save(update_fields=["image"])


def _featured_payload(request, post: BlogPost) -> dict[str, str]:
    featured = post.featured_image or {}
    source = featured.get("url") or (post.featured_image_file.url if post.featured_image_file else "")
    return {
        "url": _absolute_url(request, source),
        "alt_text": featured.get("alt") or post.featured_image_alt or "",
        "caption": featured.get("caption") or post.featured_image_caption or "",
        "credit": featured.get("credit") or post.featured_image_credit or "",
    }


class MediaUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsStaff]

    def _build_response(self, obj, serializer_class):
        serializer = serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TrekHeroUploadAPIView(MediaUploadAPIView):
    def _get_section(self, trek_slug):
        trek = get_object_or_404(TrekInfo, slug=trek_slug)
        section, _ = TrekHeroSection.objects.get_or_create(trek=trek)
        return section

    def post(self, request, trek_slug):
        hero_section = self._get_section(trek_slug)
        serializer = TrekHeroUploadSerializer(hero_section, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Hero image saved.",
                "hero_image_url": serializer.instance.image.url if serializer.instance.image else "",
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, trek_slug):
        hero_section = self._get_section(trek_slug)
        serializer = TrekHeroUploadSerializer(hero_section, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Hero metadata updated."},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, trek_slug):
        hero_section = self._get_section(trek_slug)
        hero_section.image.delete(save=False)
        hero_section.image = None
        hero_section.save(update_fields=["image"])
        return Response({"detail": "Hero image cleared."}, status=status.HTTP_204_NO_CONTENT)


class TrekGalleryUploadAPIView(MediaUploadAPIView):
    def post(self, request, trek_slug):
        trek = get_object_or_404(TrekInfo, slug=trek_slug)
        files = request.FILES.getlist("images")
        metadata_list = _parse_metadata(request.data.get("metadata"))
        if not files:
            return Response({"detail": "No files provided."}, status=status.HTTP_400_BAD_REQUEST)

        created = []
        for index, file in enumerate(files):
            metadata = metadata_list[index] if index < len(metadata_list) else {}
            serializer = TrekGalleryUploadSerializer(
                data={
                    "image": file,
                    "caption": metadata.get("caption", ""),
                    "alt_text": metadata.get("alt_text", ""),
                    "order": metadata.get("order", index),
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(trek=trek)
            created.append(
                {
                    "id": serializer.instance.pk,
                    "url": serializer.instance.image.url if serializer.instance.image else "",
                    "caption": serializer.instance.caption,
                    "alt_text": serializer.instance.alt_text,
                    "order": serializer.instance.order,
                }
            )

        return Response({"uploaded": len(created), "items": created}, status=status.HTTP_201_CREATED)


class TrekGalleryDetailAPIView(MediaUploadAPIView):
    def _get_object(self, trek_slug, pk):
        trek = get_object_or_404(TrekInfo, slug=trek_slug)
        return get_object_or_404(TrekGalleryImage, trek=trek, pk=pk)

    def get(self, request, trek_slug, pk):
        obj = self._get_object(trek_slug, pk)
        serializer = TrekGalleryUploadSerializer(obj)
        return Response(serializer.data)

    def patch(self, request, trek_slug, pk):
        obj = self._get_object(trek_slug, pk)
        serializer = TrekGalleryUploadSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Gallery image updated."})

    def delete(self, request, trek_slug, pk):
        obj = self._get_object(trek_slug, pk)
        obj.image.delete(save=False)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BlogThumbnailUploadAPIView(MediaUploadAPIView):
    def _get_post(self, slug: str) -> BlogPost:
        return get_object_or_404(BlogPost, slug=slug)

    def post(self, request, slug):
        post = self._get_post(slug)
        serializer = BlogThumbnailUploadSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        _ensure_thumbnail_url(serializer.instance)
        return Response(
            {"detail": "Thumbnail saved.", "url": serializer.instance.image_file.url if serializer.instance.image_file else ""},
            status=status.HTTP_200_OK,
        )

    def get(self, request, slug):
        post = self._get_post(slug)
        return Response(_thumbnail_payload(request, post))

    def patch(self, request, slug):
        post = self._get_post(slug)
        serializer = BlogThumbnailUploadSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        _ensure_thumbnail_url(serializer.instance)
        return Response(
            {"detail": "Thumbnail metadata updated.", "thumbnail": _thumbnail_payload(request, serializer.instance)}
        )

    def delete(self, request, slug):
        post = self._get_post(slug)
        post.image_file.delete(save=False)
        post.image_file = None
        post.image = ""
        post.image_alt = ""
        post.save(update_fields=["image_file", "image", "image_alt"])
        return Response({"detail": "Thumbnail cleared."}, status=status.HTTP_204_NO_CONTENT)


class BlogFeaturedUploadAPIView(MediaUploadAPIView):
    def _get_post(self, slug: str) -> BlogPost:
        return get_object_or_404(BlogPost, slug=slug)

    def post(self, request, slug):
        post = self._get_post(slug)
        serializer = BlogFeaturedUploadSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Featured image saved.",
                "url": serializer.instance.featured_image_file.url
                if serializer.instance.featured_image_file
                else serializer.instance.featured_image.get("url", ""),
            },
            status=status.HTTP_200_OK,
        )

    def get(self, request, slug):
        post = self._get_post(slug)
        return Response(_featured_payload(request, post))

    def patch(self, request, slug):
        post = self._get_post(slug)
        serializer = BlogFeaturedUploadSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Featured image metadata updated.", "featured": _featured_payload(request, serializer.instance)}
        )

    def delete(self, request, slug):
        post = self._get_post(slug)
        post.featured_image_file.delete(save=False)
        post.featured_image_file = None
        post.featured_image = default_featured_image()
        post.featured_image_alt = ""
        post.featured_image_caption = ""
        post.featured_image_credit = ""
        post.save(
            update_fields=[
                "featured_image_file",
                "featured_image",
                "featured_image_alt",
                "featured_image_caption",
                "featured_image_credit",
            ]
        )
        return Response({"detail": "Featured image cleared."}, status=status.HTTP_204_NO_CONTENT)


class BlogInlineImageUploadAPIView(MediaUploadAPIView):
    def post(self, request, slug):
        post = get_object_or_404(BlogPost, slug=slug)
        files = request.FILES.getlist("images")
        metadata_list = _parse_metadata(request.data.get("metadata"))
        if not files:
            return Response({"detail": "No inline images provided."}, status=status.HTTP_400_BAD_REQUEST)

        created = []
        for index, file in enumerate(files):
            metadata = metadata_list[index] if index < len(metadata_list) else {}
            serializer = BlogInlineImageUploadSerializer(
                data={
                    "image": file,
                    "alt_text": metadata.get("alt_text", ""),
                    "caption": metadata.get("caption", ""),
                    "block_id": metadata.get("block_id", ""),
                    "order": metadata.get("order", index),
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(post=post)
            created.append(
                {
                    "id": serializer.instance.pk,
                    "url": serializer.instance.image.url,
                    "alt_text": serializer.instance.alt_text,
                    "caption": serializer.instance.caption,
                    "block_id": serializer.instance.block_id,
                    "order": serializer.instance.order,
                }
            )

        return Response({"uploaded": len(created), "items": created}, status=status.HTTP_201_CREATED)


class BlogInlineImageDetailAPIView(MediaUploadAPIView):
    def _get_object(self, slug, pk):
        post = get_object_or_404(BlogPost, slug=slug)
        return get_object_or_404(BlogInlineImage, post=post, pk=pk)

    def get(self, request, slug, pk):
        serializer = BlogInlineImageUploadSerializer(self._get_object(slug, pk))
        return Response(serializer.data)

    def patch(self, request, slug, pk):
        obj = self._get_object(slug, pk)
        serializer = BlogInlineImageUploadSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Inline image updated."})

    def delete(self, request, slug, pk):
        obj = self._get_object(slug, pk)
        obj.image.delete(save=False)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TourHeroUploadAPIView(MediaUploadAPIView):
    def post(self, request, slug):
        tour = get_object_or_404(Tour, slug=slug)
        hero, _ = TourHeroImage.objects.get_or_create(tour=tour)
        serializer = TourHeroUploadSerializer(hero, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Tour hero saved.",
                "url": serializer.instance.image.url if serializer.instance.image else serializer.instance.image_url,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, slug):
        hero = get_object_or_404(TourHeroImage, tour__slug=slug)
        serializer = TourHeroUploadSerializer(hero, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Tour hero metadata updated."})

    def delete(self, request, slug):
        hero = get_object_or_404(TourHeroImage, tour__slug=slug)
        hero.image.delete(save=False)
        hero.image_url = ""
        hero.save(update_fields=["image", "image_url"])
        return Response({"detail": "Tour hero cleared."}, status=status.HTTP_204_NO_CONTENT)


class TourGalleryUploadAPIView(MediaUploadAPIView):
    def post(self, request, slug):
        tour = get_object_or_404(Tour, slug=slug)
        files = request.FILES.getlist("images")
        metadata_list = _parse_metadata(request.data.get("metadata"))
        if not files:
            return Response({"detail": "No gallery images provided."}, status=status.HTTP_400_BAD_REQUEST)

        created = []
        for index, file in enumerate(files):
            metadata = metadata_list[index] if index < len(metadata_list) else {}
            serializer = TourGalleryUploadSerializer(
                data={
                    "image": file,
                    "caption": metadata.get("caption", ""),
                    "alt_text": metadata.get("alt_text", ""),
                    "order": metadata.get("order", index),
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(tour=tour)
            created.append(
                {
                    "id": serializer.instance.pk,
                    "url": serializer.instance.image.url if serializer.instance.image else serializer.instance.image_url,
                    "caption": serializer.instance.caption,
                    "alt_text": serializer.instance.alt_text,
                    "order": serializer.instance.order,
                }
            )

        return Response({"uploaded": len(created), "items": created}, status=status.HTTP_201_CREATED)


class TourGalleryDetailAPIView(MediaUploadAPIView):
    def _get_object(self, slug, pk):
        tour = get_object_or_404(Tour, slug=slug)
        return get_object_or_404(TourGalleryImage, tour=tour, pk=pk)

    def get(self, request, slug, pk):
        serializer = TourGalleryUploadSerializer(self._get_object(slug, pk))
        return Response(serializer.data)

    def patch(self, request, slug, pk):
        obj = self._get_object(slug, pk)
        serializer = TourGalleryUploadSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Gallery image updated."})

    def delete(self, request, slug, pk):
        obj = self._get_object(slug, pk)
        obj.image.delete(save=False)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
