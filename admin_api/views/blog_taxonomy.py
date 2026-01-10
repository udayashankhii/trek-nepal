from __future__ import annotations

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from blog.blog.models import Author, Category, Region
from admin_api.permissions import IsStaff
from admin_api.serializers.blog import (
    BlogAuthorAdminSerializer,
    BlogCategoryAdminSerializer,
    BlogRegionAdminSerializer,
)


class BlogCategoryAdminViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by("order", "name")
    serializer_class = BlogCategoryAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = ["name", "slug", "description"]
    ordering_fields = ["order", "name", "created_at", "updated_at"]
    ordering = ["order", "name"]


class BlogRegionAdminViewSet(ModelViewSet):
    queryset = Region.objects.all().order_by("order", "name")
    serializer_class = BlogRegionAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = ["name", "slug", "description"]
    ordering_fields = ["order", "name", "created_at", "updated_at"]
    ordering = ["order", "name"]


class BlogAuthorAdminViewSet(ModelViewSet):
    queryset = Author.objects.all().order_by("name")
    serializer_class = BlogAuthorAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = ["name", "slug", "role"]
    ordering_fields = ["name", "created_at", "updated_at"]
    ordering = ["name"]
