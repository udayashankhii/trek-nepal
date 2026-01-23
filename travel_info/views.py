from rest_framework import generics, views
from rest_framework.response import Response

from .models import TravelInfoPage
from .serializers import TravelInfoPageDetailSerializer, TravelInfoPageListSerializer


class TravelInfoPageListAPIView(generics.ListAPIView):
    serializer_class = TravelInfoPageListSerializer

    def get_queryset(self):
        return TravelInfoPage.objects.filter(is_published=True).order_by("order", "title")


class TravelInfoPageDetailAPIView(generics.RetrieveAPIView):
    serializer_class = TravelInfoPageDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return TravelInfoPage.objects.filter(is_published=True)


class TravelInfoSitemapAPIView(views.APIView):
    def get(self, request):
        qs = TravelInfoPage.objects.filter(is_published=True).only("slug", "updated_at")
        payload = [{"slug": page.slug, "lastmod": page.updated_at.date().isoformat()} for page in qs]
        return Response(payload)
