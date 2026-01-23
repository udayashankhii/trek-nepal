# admin_api/ urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_api.views.region import RegionAdminViewSet
from admin_api.views.trek import TrekAdminViewSet
from admin_api.views.tour import TourAdminViewSet
from admin_api.views.importer import FullImportView, FullImportDetailView
from admin_api.views.treks_list import TreksListView, TrekDetailFullView
from admin_api.views.tours_list import ToursListView
from admin_api.views.blog import BlogAdminViewSet
from admin_api.views.blog_taxonomy import (
    BlogAuthorAdminViewSet,
    BlogCategoryAdminViewSet,
    BlogRegionAdminViewSet,
)
from admin_api.views.tour_taxonomy import TourStyleListView
from admin_api.views.travel_styles import TravelStyleAdminViewSet
from admin_api.views.blog_importer import BlogFullImportView, BlogFullImportDetailView
from admin_api.views.tour_importer import TourFullImportView, TourFullImportDetailView
from admin_api.views.booking import BookingAdminViewSet
from admin_api.views.travel_info import TravelInfoAdminViewSet
from admin_api.views.travel_info_importer import (
    TravelInfoPageFullImportDetailView,
    TravelInfoPageFullImportView,
)
from admin_api.views.about_info import AboutPageAdminViewSet
from admin_api.views.about_importer import AboutPageFullImportView
from admin_api.views.travel_styles_importer import (
    TravelStyleFullImportDetailView,
    TravelStyleFullImportView,
)
from admin_api.views.customize_trip import CustomizeTripAdminViewSet

router = DefaultRouter()
router.register(r"regions", RegionAdminViewSet, basename="admin-regions")
router.register(r"treks", TrekAdminViewSet, basename="admin-treks")
router.register(r"tours", TourAdminViewSet, basename="admin-tours")
router.register(r"blog-posts", BlogAdminViewSet, basename="admin-blog-posts")
router.register(r"blog-categories", BlogCategoryAdminViewSet, basename="admin-blog-categories")
router.register(r"blog-regions", BlogRegionAdminViewSet, basename="admin-blog-regions")
router.register(r"blog-authors", BlogAuthorAdminViewSet, basename="admin-blog-authors")
router.register(r"bookings", BookingAdminViewSet, basename="admin-bookings")
router.register(r"travel-info", TravelInfoAdminViewSet, basename="admin-travel-info")
router.register(r"about-pages", AboutPageAdminViewSet, basename="admin-about-pages")
router.register(r"travel-styles", TravelStyleAdminViewSet, basename="admin-travel-styles")
router.register(
    r"customize-trip",
    CustomizeTripAdminViewSet,
    basename="admin-customize-trip",
)

urlpatterns = [
    # --- Compatibility endpoints for existing Admin Frontend ---
    # Frontend calls:
    #   GET /api/admin/treks-list/
    #   GET /api/admin/treks-detail/<slug>/

    # --- Admin Auth (JWT) ---
    # POST /api/admin/auth/login/  | GET /api/admin/auth/me/  | POST /api/admin/auth/logout/
    # POST /api/admin/auth/refresh/ | POST /api/admin/auth/verify/
    path("auth/", include("admin_api.auth_urls")),
    path("treks-list/", TreksListView.as_view(), name="admin-treks-list"),
    path("treks-detail/<slug:slug>/", TrekDetailFullView.as_view(), name="admin-treks-detail"),
    path("tours-list/", ToursListView.as_view(), name="admin-tours-list"),
    path("tour-styles/", TourStyleListView.as_view(), name="admin-tour-styles"),

    # --- Tour bulk import ---
    # POST /api/admin/tours/import/full/
    path("tours/import/full/", TourFullImportView.as_view(), name="admin-tours-import-full"),
    # GET/PUT/PATCH/DELETE /api/admin/tours/import/full/<slug>/
    path(
        "tours/import/full/<slug:slug>/",
        TourFullImportDetailView.as_view(),
        name="admin-tours-import-full-detail",
    ),

    # --- Standard CRUD routes ---
    # /api/admin/regions/ , /api/admin/regions/<slug>/
    # /api/admin/treks/   , /api/admin/treks/<slug>/
    path("", include(router.urls)),

    # --- Bulk import full JSON (raw JSON or multipart file upload) ---
    # POST /api/admin/import/full/
    path("import/full/", FullImportView.as_view(), name="admin-import-full"),

    # FULL read/update/delete by slug (same import format):
    # GET/PUT/PATCH/DELETE /api/admin/import/full/<slug>/
    path("import/full/<slug:slug>/", FullImportDetailView.as_view(), name="admin-import-full-detail"),

    # --- Blog bulk import ---
    # POST /api/admin/blog/import/full/
    path("blog/import/full/", BlogFullImportView.as_view(), name="admin-blog-import-full"),

    # FULL read/update/delete by slug (+?language=en)
    # GET/PUT/PATCH/DELETE /api/admin/blog/import/full/<slug>/
    path(
        "blog/import/full/<slug:slug>/",
        BlogFullImportDetailView.as_view(),
        name="admin-blog-import-full-detail",
    ),

    # --- Travel info bulk import ---
    path(
        "travel-info/import/full/",
        TravelInfoPageFullImportView.as_view(),
        name="admin-travel-info-import-full",
    ),
    path(
        "travel-info/import/full/<slug:slug>/",
        TravelInfoPageFullImportDetailView.as_view(),
        name="admin-travel-info-import-full-detail",
    ),

    # --- Travel styles bulk import ---
    path(
        "travel-styles/import/full/",
        TravelStyleFullImportView.as_view(),
        name="admin-travel-styles-import-full",
    ),
    path(
        "travel-styles/import/full/<slug:slug>/",
        TravelStyleFullImportDetailView.as_view(),
        name="admin-travel-styles-import-full-detail",
    ),

    # --- About pages bulk import ---
    # POST /api/admin/about-pages/import/full/
    path("about-pages/import/full/", AboutPageFullImportView.as_view(), name="admin-about-pages-import-full"),
]
