# admin_api/ urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_api.views.region import RegionAdminViewSet
from admin_api.views.trek import TrekAdminViewSet
from admin_api.views.importer import FullImportView, FullImportDetailView
from admin_api.views.treks_list import TreksListView, TrekDetailFullView
from admin_api.views.blog import BlogAdminViewSet
from admin_api.views.blog_taxonomy import (
    BlogAuthorAdminViewSet,
    BlogCategoryAdminViewSet,
    BlogRegionAdminViewSet,
)
from admin_api.views.blog_importer import BlogFullImportView, BlogFullImportDetailView

router = DefaultRouter()
router.register(r"regions", RegionAdminViewSet, basename="admin-regions")
router.register(r"treks", TrekAdminViewSet, basename="admin-treks")
router.register(r"blog-posts", BlogAdminViewSet, basename="admin-blog-posts")
router.register(r"blog-categories", BlogCategoryAdminViewSet, basename="admin-blog-categories")
router.register(r"blog-regions", BlogRegionAdminViewSet, basename="admin-blog-regions")
router.register(r"blog-authors", BlogAuthorAdminViewSet, basename="admin-blog-authors")

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
]
