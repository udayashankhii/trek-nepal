from django.urls import path

from .views import (
    TravelInfoPageDetailAPIView,
    TravelInfoPageListAPIView,
    TravelInfoSitemapAPIView,
)


urlpatterns = [
    path("travel-info/pages/", TravelInfoPageListAPIView.as_view(), name="travel-info-pages"),
    path("travel-info/pages/<slug:slug>/", TravelInfoPageDetailAPIView.as_view(), name="travel-info-page-detail"),
    path("travel-info/sitemap/", TravelInfoSitemapAPIView.as_view(), name="travel-info-sitemap"),
]
