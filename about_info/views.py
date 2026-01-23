from rest_framework import generics, views
from rest_framework.response import Response

from .models import AboutPage
from .serializers import AboutPageDetailSerializer, AboutPageListSerializer


class AboutPageListAPIView(generics.ListAPIView):
    serializer_class = AboutPageListSerializer

    def get_queryset(self):
        return AboutPage.objects.filter(is_published=True).order_by("order", "title")


class AboutPageDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AboutPageDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return AboutPage.objects.filter(is_published=True).prefetch_related(
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


class AboutPageSitemapAPIView(views.APIView):
    def get(self, request):
        qs = AboutPage.objects.filter(is_published=True).only("slug", "updated_at")
        payload = [{"slug": page.slug, "lastmod": page.updated_at.date().isoformat()} for page in qs]
        return Response(payload)
