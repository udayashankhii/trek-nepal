from django.urls import path

from travel_styles.views import TravelStyleDetailAPIView, TravelStyleListAPIView

urlpatterns = [
    path("travel-styles/", TravelStyleListAPIView.as_view(), name="travel-style-list"),
    path("travel-styles/<slug:slug>/", TravelStyleDetailAPIView.as_view(), name="travel-style-detail"),
]
