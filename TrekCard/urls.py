# TrekCard/urls.py
from django.urls import path

from .views import (

    RegionListAPIView,        
    # Lists & key info
    TrekInfoListAPIView,
    TrekInfoDetailAPIView,

    # One-shot full detail
    TrekDetailAPIView,

    # Section endpoints
    TrekOverviewDetailAPIView,
    TrekItineraryListAPIView,
    TrekHighlightListAPIView,
    TrekActionAPIView,
    CostDetailAPIView,
    TrekCostAndDateSectionDetailAPIView,
    TrekFAQCategoryListAPIView,
    TrekGalleryListAPIView,
    TrekHeroSectionDetailAPIView,
    TrekElevationChartDetailAPIView,
    TrekBookingCardAPIView,
    TrekAdditionalInfoAPIView,

    # Similar & Reviews
    SimilarTreksAPIView,
    TrekReviewSectionAPIView,

    # Booking intents (UUID flow)
    CreateBookingIntentAPIView,
    RetrieveBookingIntentAPIView,
    UpdateBookingIntentAPIView,
    RegionsWithTreksNavAPIView,
)

app_name = "trekcard"

urlpatterns = [


    # Regions
    path("regions/", RegionListAPIView.as_view(), name="region-list"),
    
    # ----------------------------------------------------
    # Trek list & key info
    # ----------------------------------------------------
    path("treks/", TrekInfoListAPIView.as_view(), name="trek-list"),
    path("treks/<slug:trek_slug>/key-info/", TrekInfoDetailAPIView.as_view(), name="trek-info"),

    # ----------------------------------------------------
    # One-shot full detail payload
    # ----------------------------------------------------
    path("treks/<slug:trek_slug>/detail/", TrekDetailAPIView.as_view(), name="trek-detail"),

    # ----------------------------------------------------
    # Section endpoints
    # ----------------------------------------------------
    path("treks/<slug:trek_slug>/overview/", TrekOverviewDetailAPIView.as_view(), name="trek-overview"),
    path("treks/<slug:trek_slug>/itinerary/", TrekItineraryListAPIView.as_view(), name="trek-itinerary"),
    path("treks/<slug:trek_slug>/highlights/", TrekHighlightListAPIView.as_view(), name="trek-highlights"),
    path("treks/<slug:trek_slug>/actions/", TrekActionAPIView.as_view(), name="trek-actions"),
    path("treks/<slug:trek_slug>/costs/", CostDetailAPIView.as_view(), name="trek-costs"),
    path("treks/<slug:trek_slug>/cost-dates/", TrekCostAndDateSectionDetailAPIView.as_view(), name="trek-cost-date-section"),
    path("treks/<slug:trek_slug>/faq-categories/", TrekFAQCategoryListAPIView.as_view(), name="trek-faq-categories"),
    path("treks/<slug:trek_slug>/gallery/", TrekGalleryListAPIView.as_view(), name="trek-gallery-images"),
    path("treks/<slug:trek_slug>/hero/", TrekHeroSectionDetailAPIView.as_view(), name="trek-hero-section"),
    path("treks/<slug:trek_slug>/elevation-chart/", TrekElevationChartDetailAPIView.as_view(), name="trek-elevation-chart"),
    path("treks/<slug:trek_slug>/booking-card/", TrekBookingCardAPIView.as_view(), name="trek-booking-card"),
    path("treks/<slug:trek_slug>/additional-info/", TrekAdditionalInfoAPIView.as_view(), name="trek-additional-info"),

    # ----------------------------------------------------
    # Similar treks & Reviews
    # ----------------------------------------------------
    path("treks/<slug:trek_slug>/similar/", SimilarTreksAPIView.as_view(), name="trek-similar"),
    path("treks/<slug:trek_slug>/reviews/", TrekReviewSectionAPIView.as_view(), name="trek-reviews"),

    # ----------------------------------------------------
    # Booking intents (create by trek, then fetch/update by UUID)
    # ----------------------------------------------------
    path("treks/<slug:trek_slug>/booking-intents/", CreateBookingIntentAPIView.as_view(), name="booking-intent-create"),
    path("booking-intents/<uuid:booking_id>/", RetrieveBookingIntentAPIView.as_view(), name="booking-intent-detail"),
    path("booking-intents/<uuid:booking_id>/update/", UpdateBookingIntentAPIView.as_view(), name="booking-intent-update"),
    path("nav/regions/", RegionsWithTreksNavAPIView.as_view(), name="nav-regions"),
]
