from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from about_info.models import AboutPage
from admin_api.permissions import IsStaff
from admin_api.serializers.about_info import (
    AboutPageAdminDetailSerializer,
    AboutPageAdminListSerializer,
    AboutPageAdminWriteSerializer,
)


class AboutPageAdminViewSet(ModelViewSet):
    queryset = AboutPage.objects.all().order_by("order", "title")
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "slug", "summary"]
    ordering_fields = ["updated_at", "order", "title"]
    ordering = ["order", "title"]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return AboutPageAdminWriteSerializer
        if self.action == "retrieve":
            return AboutPageAdminDetailSerializer
        return AboutPageAdminListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "retrieve":
            return qs.prefetch_related(
                "stats",
                "features",
                "team_members",
                "documents",
                "steps",
                "policy_sections",
                "testimonials",
                "milestones",
                "ctas",
            )
        return qs
