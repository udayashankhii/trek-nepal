from __future__ import annotations

from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from blog.blog.models import BlogPost
from admin_api.permissions import IsStaff
from admin_api.serializers.blog import BlogAdminSerializer


def blog_admin_queryset():
    return BlogPost.objects.select_related("category", "region", "author").order_by(
        "-publish_date",
        "-id",
    )


class BlogAdminViewSet(ModelViewSet):
    """Admin CRUD for Blog Posts (same auth as treks).

    - GET    /api/admin/blog-posts/
    - POST   /api/admin/blog-posts/
    - GET    /api/admin/blog-posts/<slug>/?language=en
    - PATCH  /api/admin/blog-posts/<slug>/?language=en
    - DELETE /api/admin/blog-posts/<slug>/?language=en
    """

    queryset = blog_admin_queryset()
    serializer_class = BlogAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = [
        "title",
        "subtitle",
        "meta_title",
        "meta_description",
        "slug",
        "category__name",
        "region__name",
        "author__name",
    ]
    ordering_fields = ["publish_date", "views", "likes", "shares", "created_at", "updated_at"]
    ordering = ["-publish_date"]

    def _language_param(self):
        return self.request.query_params.get("language")

    def get_queryset(self):
        qs = super().get_queryset()
        language = self._language_param()
        if language:
            qs = qs.filter(language=language)

        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        category_slug = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        region_slug = self.request.query_params.get("region")
        if region_slug:
            qs = qs.filter(region__slug=region_slug)

        author_slug = self.request.query_params.get("author")
        if author_slug:
            qs = qs.filter(author__slug=author_slug)

        return qs

    def get_object(self):
        slug = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
        qs = self.get_queryset().filter(slug=slug)

        language = self._language_param()
        if language:
            qs = qs.filter(language=language)

        count = qs.count()
        if count == 0:
            raise NotFound("Blog post not found.")
        if count > 1 and not language:
            raise ValidationError({"language": "Multiple posts found for this slug. Provide ?language=xx."})

        obj = qs.first()
        self.check_object_permissions(self.request, obj)
        return obj
