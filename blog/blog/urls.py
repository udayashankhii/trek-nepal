# blog/urls.py
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BlogPostPublicViewSet,
    BlogPostWriteViewSet,
    CategoryPublicViewSet,
    RegionPublicViewSet,
    AuthorPublicViewSet,
)

router = DefaultRouter()
# Public
router.register(r"blog/posts", BlogPostPublicViewSet, basename="blog-posts")
router.register(r"blog/posts-admin", BlogPostWriteViewSet, basename="blog-posts-admin")
router.register(r"blog/categories", CategoryPublicViewSet, basename="blog-categories")
router.register(r"blog/regions", RegionPublicViewSet, basename="blog-regions")
router.register(r"blog/authors", AuthorPublicViewSet, basename="blog-authors")

urlpatterns = [
    path("", include(router.urls)),
]
