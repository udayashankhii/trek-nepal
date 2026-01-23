# admin_api/views/__init__.py
"""
Admin API views package.

Views are thin; business logic (imports, complex writes) belongs in admin_api/services/.
"""

from .region import RegionAdminViewSet
from .trek import TrekAdminViewSet
from .tour import TourAdminViewSet
from .importer import FullImportView
from .blog import BlogAdminViewSet
from .blog_taxonomy import BlogAuthorAdminViewSet, BlogCategoryAdminViewSet, BlogRegionAdminViewSet
from .blog_importer import BlogFullImportView, BlogFullImportDetailView
from .tour_importer import TourFullImportView, TourFullImportDetailView
from .booking import BookingAdminViewSet
from .travel_info import TravelInfoAdminViewSet
from .travel_info_importer import (
    TravelInfoPageFullImportDetailView,
    TravelInfoPageFullImportView,
)
from .about_info import AboutPageAdminViewSet

from .travel_styles import TravelStyleAdminViewSet
from .customize_trip import CustomizeTripAdminViewSet

__all__ = [
    "RegionAdminViewSet",
    "TrekAdminViewSet",
    "TourAdminViewSet",
    "FullImportView",
    "BlogAdminViewSet",
    "BlogCategoryAdminViewSet",
    "BlogRegionAdminViewSet",
    "BlogAuthorAdminViewSet",
    "BlogFullImportView",
    "BlogFullImportDetailView",
    "TourFullImportView",
    "TourFullImportDetailView",
    "BookingAdminViewSet",
    "TravelInfoAdminViewSet",
    "TravelInfoPageFullImportView",
    "TravelInfoPageFullImportDetailView",
    "AboutPageAdminViewSet",
    "TravelStyleAdminViewSet",
    "CustomizeTripAdminViewSet",
]
