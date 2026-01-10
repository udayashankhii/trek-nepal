"""blog/views.py

Public, SEO-friendly blog API (Django REST Framework).

Key behavior:
- Public read-only endpoints (no auth/permissions).
- Only returns published posts.
- Supports search + ordering.
- Optional filtering by category/region/author/language/tag.
- Increments view count on retrieve.
- Supports old slugs via BlogPostSlugHistory (helps SEO when slugs change).
"""

from __future__ import annotations

from django.db.models import F
from rest_framework import filters, permissions, status, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

try:
    # optional but recommended: pip install django-filter
    from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
except Exception:  # pragma: no cover
    DjangoFilterBackend = None
    FilterSet = object
    CharFilter = None

from .models import Author, BlogPost, BlogPostSlugHistory, Category, Region
from .serializers import (
    AuthorSerializer,
    BlogPostListSerializer,
    BlogPostSerializer,
    BlogPostWriteSerializer,
    CategorySerializer,
    RegionSerializer,
)


def blogpost_base_queryset():
    return BlogPost.objects.select_related("category", "region", "author").order_by(
        "-publish_date", "-id"
    )


# -----------------------------
# Optional django-filter support
# -----------------------------
class BlogPostFilter(FilterSet):
    category = CharFilter(field_name="category__slug")
    region = CharFilter(field_name="region__slug")
    author = CharFilter(field_name="author__slug")
    language = CharFilter(field_name="language")
    status = CharFilter(field_name="status")
    type = CharFilter(field_name="type")
    contentType = CharFilter(field_name="content_type")

    class Meta:
        model = BlogPost
        fields = [
            "category",
            "region",
            "author",
            "language",
            "status",
            "type",
            "contentType",
        ]


# -----------------------------
# Public API
# -----------------------------
class BlogPostPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """Public blog endpoints.

    Routes:
      - GET /api/blog/posts/
      - GET /api/blog/posts/{slug}/

    Query params:
      - search=<text>
      - ordering=publish_date | -publish_date | views | -views ...
      - category=<category_slug>
      - region=<region_slug>
      - author=<author_slug>
      - language=en
      - tag=<tag>
    """

    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    if DjangoFilterBackend:
        filter_backends.insert(0, DjangoFilterBackend)

    # broad search for frontend site-search
    search_fields = [
        "title",
        "subtitle",
        "meta_title",
        "meta_description",
        "excerpt",
        "description",
        "slug",
        "category__name",
        "region__name",
        "author__name",
    ]
    ordering_fields = ["publish_date", "views", "likes", "shares", "created_at"]
    ordering = ["-publish_date"]
    filterset_class = BlogPostFilter if DjangoFilterBackend else None

    def get_queryset(self):
        qs = blogpost_base_queryset().filter(status=BlogPost.Status.PUBLISHED)

        # lightweight filters (works even when django-filter isn't installed)
        params = self.request.query_params
        if not DjangoFilterBackend:
            if params.get("category"):
                qs = qs.filter(category__slug=params["category"])
            if params.get("region"):
                qs = qs.filter(region__slug=params["region"])
            if params.get("author"):
                qs = qs.filter(author__slug=params["author"])
            if params.get("language"):
                qs = qs.filter(language=params["language"])

        tag = params.get("tag")
        if tag:
            # JSONField containment works best on Postgres.
            # On SQLite, behavior may vary by Django version.
            try:
                qs = qs.filter(taxonomies__tags__contains=[tag])
            except Exception:
                # fallback: slower contains on raw json text
                qs = qs.filter(taxonomies__icontains=tag)

        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return BlogPostListSerializer
        return BlogPostSerializer

    def _get_post_by_slug_or_history(self, slug: str) -> tuple[BlogPost | None, str | None]:
        """Return (post, resolved_slug).

        If slug is an old slug, resolves via BlogPostSlugHistory.
        """
        post = self.get_queryset().filter(slug=slug).first()
        if post:
            return post, None

        hist = (
            BlogPostSlugHistory.objects.select_related("post")
            .filter(old_slug=slug)
            .order_by("-updated_at")
            .first()
        )
        if not hist:
            return None, None

        # increment redirect count (SEO analytics)
        BlogPostSlugHistory.objects.filter(pk=hist.pk).update(redirect_count=F("redirect_count") + 1)
        if hist.post.status != BlogPost.Status.PUBLISHED:
            return None, None
        return hist.post, hist.post.slug

    def retrieve(self, request, *args, **kwargs):
        requested_slug = kwargs.get(self.lookup_field)
        post, canonical_slug = self._get_post_by_slug_or_history(requested_slug)
        if not post:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Increment views (atomic)
        BlogPost.objects.filter(pk=post.pk).update(views=F("views") + 1)
        post.refresh_from_db(fields=["views"])

        serializer = self.get_serializer(post)
        headers = {}
        if canonical_slug and canonical_slug != requested_slug:
            headers["X-Canonical-Slug"] = canonical_slug
        return Response(serializer.data, headers=headers)


class BlogPostWriteViewSet(viewsets.ModelViewSet):
    """Create/update posts (no auth yet; use for local testing)."""

    permission_classes = [permissions.AllowAny]
    queryset = BlogPost.objects.all().order_by("-id")
    http_method_names = ["post", "put", "patch", "delete", "head", "options"]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return BlogPostWriteSerializer
        return BlogPostSerializer

    def create(self, request, *args, **kwargs):
        write_serializer = BlogPostWriteSerializer(
            data=request.data, context=self.get_serializer_context()
        )
        write_serializer.is_valid(raise_exception=True)
        self.perform_create(write_serializer)

        read_serializer = BlogPostSerializer(
            write_serializer.instance, context=self.get_serializer_context()
        )
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        write_serializer = BlogPostWriteSerializer(
            instance, data=request.data, partial=partial, context=self.get_serializer_context()
        )
        write_serializer.is_valid(raise_exception=True)
        self.perform_update(write_serializer)

        read_serializer = BlogPostSerializer(
            write_serializer.instance, context=self.get_serializer_context()
        )
        return Response(read_serializer.data, status=status.HTTP_200_OK)


class CategoryPublicViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.filter(is_active=True).order_by("order", "name")
    serializer_class = CategorySerializer
    lookup_field = "slug"


class RegionPublicViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Region.objects.filter(is_active=True).order_by("order", "name")
    serializer_class = RegionSerializer
    lookup_field = "slug"


class AuthorPublicViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Author.objects.all().order_by("name")
    serializer_class = AuthorSerializer
    lookup_field = "slug"
