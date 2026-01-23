from django.urls import path

from .views import (
    TourListAPIView,
    TourDetailAPIView,
    TourDetailFullAPIView,
    TourHeroAPIView,
    TourKeyInfoAPIView,
    TourOverviewDetailAPIView,
    TourItineraryListAPIView,
    TourHighlightListAPIView,
    TourCostDetailAPIView,
    TourAdditionalInfoAPIView,
    TourGroupPriceListAPIView,
    TourGalleryListAPIView,
    TourBookingCardAPIView,
    TourSEOAPIView,
    TourLinksAPIView,
    TourSimilarAPIView,
    TourReviewsAPIView,
    TourSitemapAPIView,
)


app_name = "tours"

urlpatterns = [
    path("tours/", TourListAPIView.as_view(), name="tour-list"),
    path("tours/sitemap/", TourSitemapAPIView.as_view(), name="tour-sitemap"),
    path("tours/<slug:tour_slug>/", TourDetailAPIView.as_view(), name="tour-detail"),
    path("tours/<slug:tour_slug>/detail/", TourDetailFullAPIView.as_view(), name="tour-detail-full"),
    path("tours/<slug:tour_slug>/hero/", TourHeroAPIView.as_view(), name="tour-hero"),
    path("tours/<slug:tour_slug>/key-info/", TourKeyInfoAPIView.as_view(), name="tour-key-info"),
    path("tours/<slug:tour_slug>/overview/", TourOverviewDetailAPIView.as_view(), name="tour-overview"),
    path("tours/<slug:tour_slug>/itinerary/", TourItineraryListAPIView.as_view(), name="tour-itinerary"),
    path("tours/<slug:tour_slug>/highlights/", TourHighlightListAPIView.as_view(), name="tour-highlights"),
    path("tours/<slug:tour_slug>/cost/", TourCostDetailAPIView.as_view(), name="tour-cost"),
    path("tours/<slug:tour_slug>/additional-info/", TourAdditionalInfoAPIView.as_view(), name="tour-additional-info"),
    path("tours/<slug:tour_slug>/group-prices/", TourGroupPriceListAPIView.as_view(), name="tour-group-prices"),
    path("tours/<slug:tour_slug>/gallery/", TourGalleryListAPIView.as_view(), name="tour-gallery"),
    path("tours/<slug:tour_slug>/booking-card/", TourBookingCardAPIView.as_view(), name="tour-booking-card"),
    path("tours/<slug:tour_slug>/seo/", TourSEOAPIView.as_view(), name="tour-seo"),
    path("tours/<slug:tour_slug>/links/", TourLinksAPIView.as_view(), name="tour-links"),
    path("tours/<slug:tour_slug>/similar/", TourSimilarAPIView.as_view(), name="tour-similar"),
    path("tours/<slug:tour_slug>/reviews/", TourReviewsAPIView.as_view(), name="tour-reviews"),
]
