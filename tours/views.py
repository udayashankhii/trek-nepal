from django.db.models import Prefetch, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views
from rest_framework.response import Response

from .models import (
    Tour,
    TourOverview,
    TourItineraryDay,
    TourHighlight,
    TourCost,
    TourAdditionalInfoSection,
    TourGroupPrice,
    TourGalleryImage,
    TourSEO,
    TourInternalLink,
    TourBacklink,
    SimilarTour,
    TourReview,
)
from .serializers import (
    TourListSerializer,
    TourSerializer,
    TourDetailSerializer,
    TourOverviewSerializer,
    TourItineraryDaySerializer,
    TourHighlightSerializer,
    TourCostSerializer,
    TourAdditionalInfoSectionSerializer,
    TourGroupPriceSerializer,
    TourGalleryImageSerializer,
    TourSEOSerializer,
    TourInternalLinkSerializer,
    TourBacklinkSerializer,
    TourReviewSerializer,
    TourReviewCreateSerializer,
    TourHeroSerializer,
    TourKeyInfoSerializer,
    TourBookingCardSerializer,
    SimilarTourCardSerializer,
)


def tour_full_queryset():
    return (
        Tour.objects.select_related("overview", "cost", "seo")
        .prefetch_related(
            "itinerary_days",
            "highlight_items",
            "additional_info_sections",
            "group_prices",
            "gallery_images",
            "internal_links",
            "backlinks",
            Prefetch("reviews", queryset=TourReview.objects.filter(is_published=True)),
            Prefetch(
                "similar_tours",
                queryset=SimilarTour.objects.select_related("related_tour").filter(related_tour__is_published=True),
            ),
            "travel_styles",
        )
    )


class TourListAPIView(generics.ListCreateAPIView):
    queryset = Tour.objects.filter(is_published=True).order_by("-created_at")

    def get_queryset(self):
        if self.request.method == "POST":
            return Tour.objects.all()
        qs = super().get_queryset()
        style = self.request.query_params.get("style")
        category = self.request.query_params.get("category")
        tag = self.request.query_params.get("tag")
        search = self.request.query_params.get("q")

        if style:
            normalized = style.lower()
            qs = (
                qs.filter(
                    Q(travel_style__iexact=normalized)
                    | Q(primary_style__slug__iexact=normalized)
                    | Q(travel_styles__slug__iexact=normalized)
                )
                .distinct()
            )
        if category:
            qs = qs.filter(
                Q(categories__contains=[category])
                | Q(categories__contains=[category.lower()])
                | Q(categories__contains=[category.upper()])
            )
        if tag:
            qs = qs.filter(
                Q(tags__contains=[tag])
                | Q(tags__contains=[tag.lower()])
                | Q(tags__contains=[tag.upper()])
            )
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(tagline__icontains=search)
                | Q(short_description__icontains=search)
                | Q(long_description__icontains=search)
            )
        return qs

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TourSerializer
        return TourListSerializer



class TourDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    lookup_url_kwarg = "tour_slug"
    lookup_field = "slug"
    queryset = tour_full_queryset()

    def get_queryset(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return tour_full_queryset()
        return tour_full_queryset().filter(is_published=True)

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return TourSerializer
        return TourDetailSerializer


class TourHeroAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(Tour.objects.select_related("overview"), slug=tour_slug, is_published=True)
        subtitle = ""
        if getattr(tour, "overview", None) and tour.overview.paragraphs:
            subtitle = str(tour.overview.paragraphs[0])
        elif tour.long_description:
            subtitle = tour.long_description
        data = {
            "title": tour.title,
            "subtitle": subtitle,
            "image_url": tour.image_url,
            "image": tour.image_url,
            "location": tour.location,
            "badge": tour.badge,
            "duration": tour.duration,
            "group_size": tour.group_size,
        }
        return Response(TourHeroSerializer(data).data)


class TourKeyInfoAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(Tour, slug=tour_slug, is_published=True)
        payload = {
            "duration": tour.duration,
            "difficulty": tour.difficulty,
            "start_point": tour.start_point,
            "group_size": tour.group_size,
            "max_altitude": tour.max_altitude,
            "activity": tour.activity,
            "rating": tour.rating,
            "reviews_count": tour.reviews_count,
        }
        return Response(TourKeyInfoSerializer(payload).data)


class TourOverviewDetailAPIView(generics.RetrieveAPIView):
    serializer_class = TourOverviewSerializer
    lookup_field = "tour__slug"
    lookup_url_kwarg = "tour_slug"

    def get_queryset(self):
        return TourOverview.objects.select_related("tour").filter(tour__is_published=True)


class TourItineraryListAPIView(generics.ListAPIView):
    serializer_class = TourItineraryDaySerializer

    def get_queryset(self):
        return (
            TourItineraryDay.objects.select_related("tour")
            .filter(tour__slug=self.kwargs["tour_slug"], tour__is_published=True)
            .order_by("day")
        )


class TourHighlightListAPIView(generics.ListAPIView):
    serializer_class = TourHighlightSerializer

    def get_queryset(self):
        return (
            TourHighlight.objects.select_related("tour")
            .filter(tour__slug=self.kwargs["tour_slug"], tour__is_published=True)
            .order_by("order")
        )


class TourCostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = TourCostSerializer
    lookup_field = "tour__slug"
    lookup_url_kwarg = "tour_slug"

    def get_queryset(self):
        return TourCost.objects.select_related("tour").filter(tour__is_published=True)


class TourAdditionalInfoAPIView(generics.ListAPIView):
    serializer_class = TourAdditionalInfoSectionSerializer

    def get_queryset(self):
        return (
            TourAdditionalInfoSection.objects.select_related("tour")
            .filter(tour__slug=self.kwargs["tour_slug"], tour__is_published=True)
            .order_by("order")
        )


class TourGroupPriceListAPIView(generics.ListAPIView):
    serializer_class = TourGroupPriceSerializer

    def get_queryset(self):
        return (
            TourGroupPrice.objects.select_related("tour")
            .filter(tour__slug=self.kwargs["tour_slug"], tour__is_published=True)
            .order_by("order")
        )


class TourGalleryListAPIView(generics.ListAPIView):
    serializer_class = TourGalleryImageSerializer

    def get_queryset(self):
        return (
            TourGalleryImage.objects.select_related("tour")
            .filter(tour__slug=self.kwargs["tour_slug"], tour__is_published=True)
            .order_by("order")
        )


class TourBookingCardAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(
            Tour.objects.prefetch_related("group_prices"),
            slug=tour_slug,
            is_published=True,
        )
        payload = {
            "base_price": tour.base_price or tour.price,
            "original_price": tour.original_price or tour.old_price,
            "badge": tour.badge,
            "group_prices": TourGroupPriceSerializer(tour.group_prices.all(), many=True).data,
            "groupPrices": TourGroupPriceSerializer(tour.group_prices.all(), many=True).data,
        }
        return Response(TourBookingCardSerializer(payload).data)


class TourSEOAPIView(generics.RetrieveAPIView):
    serializer_class = TourSEOSerializer
    lookup_field = "tour__slug"
    lookup_url_kwarg = "tour_slug"

    def get_queryset(self):
        return TourSEO.objects.select_related("tour").filter(tour__is_published=True)


class TourLinksAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(Tour, slug=tour_slug, is_published=True)
        internal = TourInternalLinkSerializer(tour.internal_links.all(), many=True).data
        backlinks = TourBacklinkSerializer(tour.backlinks.filter(is_active=True), many=True).data
        return Response({"internal_links": internal, "backlinks": backlinks})


class TourSimilarAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(Tour, slug=tour_slug, is_published=True)
        manual = (
            SimilarTour.objects.filter(tour=tour)
            .select_related("related_tour")
            .filter(related_tour__is_published=True)
            .order_by("order")
        )
        if manual.exists():
            return Response(SimilarTourCardSerializer(manual, many=True).data)

        categories = tour.categories or []
        tags = tour.tags or []
        similar_filter = Q()
        for category in categories:
            similar_filter |= Q(categories__contains=[category])
        for tag in tags:
            similar_filter |= Q(tags__contains=[tag])
        if tour.primary_style and tour.primary_style.slug:
            normalized_primary = tour.primary_style.slug.lower()
            similar_filter |= Q(primary_style__slug__iexact=normalized_primary)
        for style in tour.travel_styles.all():
            if style.slug:
                slug = style.slug.lower()
                similar_filter |= Q(travel_styles__slug__iexact=slug)
        if tour.travel_style:
            similar_filter |= Q(travel_style__iexact=tour.travel_style)

        if not similar_filter.children:
            return Response([])

        qs = (
            Tour.objects.filter(is_published=True)
            .exclude(pk=tour.pk)
            .filter(similar_filter)
            .distinct()
            .order_by("-rating", "-reviews_count")
        )[:3]
        payload = [
            {
                "slug": t.slug,
                "title": t.title,
                "image_url": t.image_url,
                "duration": t.duration,
                "rating": t.rating,
                "reviews_count": t.reviews_count,
                "price": t.price,
                "badge": t.badge,
                "location": t.location,
                "tagline": t.tagline,
            }
            for t in qs
        ]
        return Response(payload)


class TourReviewsAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(Tour, slug=tour_slug, is_published=True)
        qs = tour.reviews.filter(is_published=True)
        return Response(TourReviewSerializer(qs, many=True).data)

    def post(self, request, tour_slug):
        tour = get_object_or_404(Tour, slug=tour_slug)
        serializer = TourReviewCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        review = serializer.save(tour=tour)
        return Response(TourReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class TourDetailFullAPIView(views.APIView):
    def get(self, request, tour_slug):
        tour = get_object_or_404(tour_full_queryset(), slug=tour_slug, is_published=True)
        return Response(TourDetailSerializer(tour).data)


class TourSitemapAPIView(views.APIView):
    def get(self, request):
        qs = Tour.objects.filter(is_published=True).only("slug", "updated_at")
        payload = [{"slug": t.slug, "lastmod": t.updated_at.date().isoformat()} for t in qs]
        return Response(payload)
