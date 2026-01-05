# admin_api/ urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_api.views.region import RegionAdminViewSet
from admin_api.views.trek import TrekAdminViewSet
from admin_api.views.importer import FullImportView, FullImportDetailView

router = DefaultRouter()
router.register(r"regions", RegionAdminViewSet, basename="admin-regions")
router.register(r"treks", TrekAdminViewSet, basename="admin-treks")

urlpatterns = [
    # CRUD routes:
    # /api/admin/regions/ , /api/admin/regions/<slug>/
    # /api/admin/treks/   , /api/admin/treks/<slug>/
    path("", include(router.urls)),

    # Bulk import full JSON:
    # POST /api/admin/import/full/
    path("import/full/", FullImportView.as_view(), name="admin-import-full"),

    # FULL read/update/delete by slug (same import format):
    # GET/PUT/PATCH/DELETE /api/admin/import/full/<slug>/
    path("import/full/<slug:slug>/", FullImportDetailView.as_view(), name="admin-import-full-detail"),
]
