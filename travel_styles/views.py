from django.db.models import Count
from rest_framework import generics
from rest_framework.response import Response

from travel_styles.models import TravelStyle
from travel_styles.serializers import (
    TravelStylePublicSerializer,
    TravelStyleTourPublicSerializer,
)


class TravelStyleListAPIView(generics.ListAPIView):
    queryset = TravelStyle.objects.filter(is_published=True).annotate(
        tour_count=Count("travel_style_tours", distinct=True)
    ).order_by("order", "name")
    serializer_class = TravelStylePublicSerializer
    filterset_fields = ["is_published"]
    search_fields = ["name", "description"]


class TravelStyleDetailAPIView(generics.RetrieveAPIView):
    serializer_class = TravelStylePublicSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return (
            TravelStyle.objects.filter(is_published=True)
            .annotate(tour_count=Count("travel_style_tours", distinct=True))
            .prefetch_related("travel_style_tours__tour")
        )

    def retrieve(self, request, *args, **kwargs):
        travel_style = self.get_object()
        tours_qs = travel_style.travel_style_tours.select_related("tour").order_by("order", "id")
        featured_qs = tours_qs.filter(is_featured=True)

        payload = {
            "travel_style": self.get_serializer(travel_style).data,
            "featured_tours": TravelStyleTourPublicSerializer(featured_qs, many=True).data,
            "tours": TravelStyleTourPublicSerializer(tours_qs, many=True).data,
        }
        return Response(payload)
