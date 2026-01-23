from django.urls import path

from .views import (
    CustomizeTripRequestAdminDetailAPIView,
    CustomizeTripRequestAdminListAPIView,
    CustomizeTripRequestAdminUpdateAPIView,
    CustomizeTripRequestCreateAPIView,
)

app_name = "customize_trip"

urlpatterns = [
    path("requests/", CustomizeTripRequestCreateAPIView.as_view(), name="requests-create"),
    path("requests/admin/", CustomizeTripRequestAdminListAPIView.as_view(), name="admin-list"),
    path(
        "requests/admin/<str:request_ref>/",
        CustomizeTripRequestAdminDetailAPIView.as_view(),
        name="admin-detail",
    ),
    path(
        "requests/admin/<str:request_ref>/update/",
        CustomizeTripRequestAdminUpdateAPIView.as_view(),
        name="admin-update",
    ),
]
