from django.urls import path

from search.views import UnifiedSearchAPIView


app_name = "search"

urlpatterns = [
    path("", UnifiedSearchAPIView.as_view(), name="unified-search"),
]
