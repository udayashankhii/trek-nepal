# TrekCard/views.py
from __future__ import annotations

from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count,Prefetch
from rest_framework import generics, permissions, views, response, status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser


from .models import (
    Region,TrekInfo, TrekOverview, TrekItineraryDay, TrekHighlight, TrekAction, Cost,
    TrekCostAndDateSection, TrekFAQCategory, TrekGalleryImage, TrekHeroSection,
    TrekElevationChart, TrekBookingCard, TrekAdditionalInfoSection, BookingIntent,
    TrekDeparture, SimilarTrek, TrekReview,
)

from .serializers import (
    RegionSerializer,TrekInfoSerializer, TrekOverviewSerializer, TrekItineraryDaySerializer, TrekHighlightSerializer,
    TrekActionSerializer, CostSerializer, TrekCostAndDateSectionSerializer, TrekFAQCategorySerializer,
    TrekGalleryImageSerializer, TrekHeroSectionSerializer, TrekElevationChartSerializer,
    TrekBookingCardSerializer, TrekAdditionalInfoSectionSerializer, BookingIntentSerializer,
    TrekDetailSerializer, SimilarTrekCardSerializer, TrekReviewSerializer,NavRegionWithTreksSerializer,
)


class RegionsWithTreksNavAPIView(generics.ListAPIView):
    """
    Navbar data:
    GET /api/nav/regions/?limit_per_region=50&include_empty=false
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = NavRegionWithTreksSerializer

    def get_queryset(self):
        limit = self.request.query_params.get("limit_per_region")
        include_empty = self.request.query_params.get("include_empty", "false").lower() == "true"

        qs = Region.objects.annotate(treks_count=Count("treks")).order_by("order", "name")
        if not include_empty:
            qs = qs.filter(treks_count__gt=0)

        treks_qs = TrekInfo.objects.only("title", "slug").order_by("title")
        if limit and str(limit).isdigit():
            treks_qs = TrekInfo.objects.only("title", "slug").order_by("title")[:int(limit)]

        return qs.prefetch_related(
            Prefetch("treks", queryset=treks_qs, to_attr="prefetched_treks")
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        for r in queryset:
            r.treks = getattr(r, "prefetched_treks", [])
        return super().list(request, *args, **kwargs)
    


    
class RegionListAPIView(generics.ListAPIView):
    """
    Returns regions for the mega-menu / region pages.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegionSerializer
    queryset = (
        Region.objects
        .annotate(treks_count=Count("treks"))     # ← add this
        .order_by("order", "name")
    )


# =========================================================
# Trek list / key info detail
# =========================================================

class TrekInfoListAPIView(generics.ListAPIView):
    """
    Optional: a list endpoint for explore/search views.
    Supports server-side filtering by region: /treks/?region=<slug>
    Also keeps existing filters for activity, trip_grade, etc.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekInfoSerializer

    def get_queryset(self):
        qs = (
            TrekInfo.objects
            .select_related("region")   # ⬅️ so region fields serialize fast
            .all()
        )

        # --- Filters ---
        region_slug = self.request.query_params.get("region")
        if region_slug:
            qs = qs.filter(region__slug=region_slug)

        activity = self.request.query_params.get("activity")
        if activity:
            qs = qs.filter(activity__iexact=activity)

        trip_grade = self.request.query_params.get("trip_grade")
        if trip_grade:
            qs = qs.filter(trip_grade__iexact=trip_grade)

        # You can add search by title if needed:
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(title__icontains=q)

        return qs


class TrekInfoDetailAPIView(generics.RetrieveAPIView):
    """
    Basic key-info detail for header/cards.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekInfoSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "trek_slug"
    queryset = TrekInfo.objects.all()


# =========================================================
# Section endpoints (Overview, Itinerary, Highlights, etc.)
# =========================================================

class TrekOverviewDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekOverviewSerializer
    lookup_field = "trek__slug"
    lookup_url_kwarg = "trek_slug"

    def get_queryset(self):
        return TrekOverview.objects.select_related("trek").prefetch_related("sections__bullets")


class TrekItineraryListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekItineraryDaySerializer

    def get_queryset(self):
        return (
            TrekItineraryDay.objects
            .select_related("trek")
            .filter(trek__slug=self.kwargs["trek_slug"])
            .order_by("day")
        )


class TrekHighlightListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekHighlightSerializer

    def get_queryset(self):
        return (
            TrekHighlight.objects
            .select_related("trek")
            .filter(trek__slug=self.kwargs["trek_slug"])
        )


class TrekActionAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekActionSerializer

    def get_object(self):
        return get_object_or_404(
            TrekAction.objects.select_related("trek"),
            trek__slug=self.kwargs["trek_slug"],
        )


class CostDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CostSerializer

    def get_object(self):
        return get_object_or_404(
            Cost.objects.select_related("trek"),
            trek__slug=self.kwargs["trek_slug"],
        )


class TrekCostAndDateSectionDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekCostAndDateSectionSerializer
    lookup_field = "trek__slug"
    lookup_url_kwarg = "trek_slug"

    def get_queryset(self):
        return TrekCostAndDateSection.objects.select_related("trek")


class TrekFAQCategoryListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekFAQCategorySerializer

    def get_queryset(self):
        return (
            TrekFAQCategory.objects
            .select_related("trek")
            .prefetch_related("questions")
            .filter(trek__slug=self.kwargs["trek_slug"])
            .order_by("order", "id")
        )


class TrekGalleryListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekGalleryImageSerializer

    def get_queryset(self):
        return (
            TrekGalleryImage.objects
            .select_related("trek")
            .filter(trek__slug=self.kwargs["trek_slug"])
            .order_by("order", "id")
        )


class TrekHeroSectionDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekHeroSectionSerializer
    lookup_field = "trek__slug"
    lookup_url_kwarg = "trek_slug"

    def get_queryset(self):
        return TrekHeroSection.objects.select_related("trek")


class TrekElevationChartDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekElevationChartSerializer
    lookup_field = "trek__slug"
    lookup_url_kwarg = "trek_slug"

    def get_queryset(self):
        return (
            TrekElevationChart.objects
            .select_related("trek")
            .prefetch_related("points")
        )


class TrekBookingCardAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekBookingCardSerializer
    lookup_field = "trek__slug"
    lookup_url_kwarg = "trek_slug"

    def get_queryset(self):
        return (
            TrekBookingCard.objects
            .select_related("trek")
            .prefetch_related("group_prices")
        )


class TrekAdditionalInfoAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrekAdditionalInfoSectionSerializer

    def get_queryset(self):
        trek_slug = self.kwargs["trek_slug"]
        return (
            TrekAdditionalInfoSection.objects
            .select_related("trek")
            .prefetch_related("bullets")
            .filter(trek__slug=trek_slug)
            .order_by("order")
        )


# =========================================================
# Similar treks
# =========================================================

class SimilarTreksAPIView(generics.ListAPIView):
    """
    - If manual SimilarTrek relations exist, return those (ordered).
    - Else fallback to same-activity suggestions (top 6 by rating/reviews).
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = SimilarTrekCardSerializer

    def get_queryset(self):
        trek = get_object_or_404(TrekInfo, slug=self.kwargs["trek_slug"])

        manual = (
            SimilarTrek.objects
            .filter(trek=trek)
            .select_related("related_trek__hero_section", "related_trek__booking_card")
            .order_by("order")
        )
        if manual.exists():
            ids = manual.values_list("related_trek__id", flat=True)
            return (
                TrekInfo.objects
                .filter(id__in=ids)
                .select_related("hero_section", "booking_card")
            )

        return (
            TrekInfo.objects
            .exclude(pk=trek.pk)
            .filter(activity=trek.activity)
            .select_related("hero_section", "booking_card")
            .order_by("-rating", "-reviews")[:6]
        )


# =========================================================
# Reviews (for ReviewSection component)
# =========================================================

class TrekReviewSectionAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request, trek_slug):
        trek = get_object_or_404(TrekInfo, slug=trek_slug)

        qs = (
            TrekReview.objects
            .filter(trek=trek, is_published=True)
            .order_by("-created_at")
        )

        results = []
        for r in qs:
            results.append({
                "id": r.id,
                "reviewer_name": r.reviewer_name,
                "reviewer_country": r.reviewer_country,
                "reviewer_avatar": request.build_absolute_uri(r.reviewer_avatar.url) if r.reviewer_avatar else None,
                "rating": r.rating,
                "title": r.title,
                "body": r.body,
                "source": r.source,
                "is_published": r.is_published,
                "created_at": r.created_at.isoformat(),
            })

        return response.Response(
            {
                "trek": {"slug": trek.slug, "title": trek.title},
                "count": len(results),
                "results": results,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, trek_slug):
        """
        Create a new review for a trek.
        Accepts JSON or multipart/form-data.

        Expected fields (your serializer decides exact names):
          reviewer_name, reviewer_country, rating, title, body, reviewer_avatar(optional)
        """
        trek = get_object_or_404(TrekInfo.objects.only("id", "title", "slug"), slug=trek_slug)

        create_ser = TrekReviewCreateSerializer(data=request.data, context={"request": request})
        create_ser.is_valid(raise_exception=True)

        review = create_ser.save(
            trek=trek,
            source=ReviewSource.INTERNAL,
            is_published=True,  # set False if you want admin moderation
        )

        out = TrekReviewSerializer(review, context={"request": request}).data
        return response.Response(out, status=status.HTTP_201_CREATED)


# =========================================================
# Booking intents (UUID, minimal flow)
# =========================================================

class CreateBookingIntentAPIView(views.APIView):
    """
    POST /treks/<slug>/booking-intents/
    Body: { "departure": <id?>, "party_size": 1, "email"?: "...", "phone"?: "..." }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trek_slug):
        trek = get_object_or_404(
            TrekInfo.objects.select_related("booking_card"),
            slug=trek_slug,
        )

        # snapshot base/original price for quote
        snap = {}
        if getattr(trek, "booking_card", None):
            snap["base_price"] = str(trek.booking_card.base_price)
            if trek.booking_card.original_price:
                snap["original_price"] = str(trek.booking_card.original_price)

        departure = None
        dep_id = request.data.get("departure")
        if dep_id:
            departure = get_object_or_404(TrekDeparture, pk=dep_id, trek=trek)

        party_size = int(request.data.get("party_size", 1))
        email = request.data.get("email") or request.user.email or None
        phone = request.data.get("phone") or getattr(getattr(request.user, "profile", None), "phone_number", None) or None

        intent = BookingIntent.objects.create(
            trek=trek,
            user=request.user,
            departure=departure,
            party_size=party_size,
            price_snapshot=snap,
            email=email,
            phone=phone,
        )
        return response.Response(BookingIntentSerializer(intent).data, status=status.HTTP_201_CREATED)


class RetrieveBookingIntentAPIView(generics.RetrieveAPIView):
    """
    GET /booking-intents/<uuid:booking_id>/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingIntentSerializer
    lookup_field = "booking_id"
    queryset = BookingIntent.objects.select_related("trek", "departure")

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)


class UpdateBookingIntentAPIView(views.APIView):
    """
    PATCH /booking-intents/<uuid:booking_id>/update/
    Body may include any of: { "departure": <id|null>, "party_size": int, "email": str, "phone": str }
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, booking_id):
        intent = get_object_or_404(
            BookingIntent.objects.select_related("trek", "departure"),
            booking_id=booking_id,
        )

        if not request.user.is_staff and intent.user_id != request.user.id:
            return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        if "departure" in request.data:
            dep_id = request.data.get("departure")
            if dep_id is None or dep_id == "":
                intent.departure = None
            else:
                intent.departure = get_object_or_404(TrekDeparture, pk=dep_id, trek=intent.trek)

        if "party_size" in request.data:
            intent.party_size = int(request.data["party_size"])

        if "email" in request.data:
            intent.email = request.data["email"] or None

        if "phone" in request.data:
            intent.phone = request.data["phone"] or None

        intent.save()
        return response.Response(BookingIntentSerializer(intent).data, status=status.HTTP_200_OK)


# =========================================================
# Optional: One-shot trek detail payload
# =========================================================

class TrekDetailAPIView(views.APIView):
    """
    Returns a composed payload suitable for a single trek page load.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, trek_slug):
        trek_qs = (
            TrekInfo.objects
            .select_related(
                "overview",
                "hero_section",
                "elevation_chart",
                "booking_card",
                "cost_and_date_section",
                "action",
                "cost",
            )
            .prefetch_related(
                "overview__sections__bullets",
                "itinerary_days",
                "highlights",
                "departures",
                "group_prices",
                "date_highlights",
                "faq_categories__questions",
                "gallery_images",
                "elevation_chart__points",
                "booking_card__group_prices",
                "additional_info_sections__bullets",
            )
        )
        trek = get_object_or_404(trek_qs, slug=trek_slug)

        payload = {
            "trek": TrekInfoSerializer(trek, context={"request": request}).data,
            "hero": TrekHeroSectionSerializer(getattr(trek, "hero_section", None), context={"request": request}).data if hasattr(trek, "hero_section") else None,
            "overview": TrekOverviewSerializer(getattr(trek, "overview", None)).data if hasattr(trek, "overview") else None,
            "itinerary": TrekItineraryDaySerializer(trek.itinerary_days.all(), many=True).data,
            "highlights": TrekHighlightSerializer(trek.highlights.all(), many=True).data,
            "actions": TrekActionSerializer(getattr(trek, "action", None), context={"request": request}).data if hasattr(trek, "action") else None,
            "cost": CostSerializer(getattr(trek, "cost", None)).data if hasattr(trek, "cost") else None,
            "cost_dates": TrekCostAndDateSectionSerializer(getattr(trek, "cost_and_date_section", None)).data if hasattr(trek, "cost_and_date_section") else None,
            "faq_categories": TrekFAQCategorySerializer(trek.faq_categories.all(), many=True).data,
            "gallery": TrekGalleryImageSerializer(trek.gallery_images.all(), many=True, context={"request": request}).data,
            "elevation_chart": TrekElevationChartSerializer(getattr(trek, "elevation_chart", None), context={"request": request}).data if hasattr(trek, "elevation_chart") else None,
            "booking_card": TrekBookingCardSerializer(getattr(trek, "booking_card", None)).data if hasattr(trek, "booking_card") else None,
            "additional_info": TrekAdditionalInfoSectionSerializer(trek.additional_info_sections.all(), many=True).data,
        }

        # (Optional) include similar treks in the one-shot payload
        similar_qs = (
            TrekInfo.objects
            .filter(activity=trek.activity)
            .exclude(pk=trek.pk)
            .select_related("hero_section", "booking_card")
            .order_by("-rating", "-reviews")[:6]
        )
        payload["similar"] = SimilarTrekCardSerializer(similar_qs, many=True, context={"request": request}).data

        # Wrap with a read-only serializer for consistency (optional)
        return response.Response(payload, status=status.HTTP_200_OK)
