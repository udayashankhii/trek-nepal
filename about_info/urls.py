from django.urls import path

from .views import AboutPageDetailAPIView, AboutPageListAPIView, AboutPageSitemapAPIView


urlpatterns = [
    path("about/pages/", AboutPageListAPIView.as_view(), name="about-pages"),
    path("about/pages/<slug:slug>/", AboutPageDetailAPIView.as_view(), name="about-page-detail"),
    path("about/sitemap/", AboutPageSitemapAPIView.as_view(), name="about-sitemap"),
]
