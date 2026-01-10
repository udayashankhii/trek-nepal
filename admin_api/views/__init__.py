# admin_api/views/__init__.py
"""
Admin API views package.

Views are thin; business logic (imports, complex writes) belongs in admin_api/services/.
"""

from .region import RegionAdminViewSet
from .trek import TrekAdminViewSet
from .importer import FullImportView
from .blog import BlogAdminViewSet
from .blog_taxonomy import BlogAuthorAdminViewSet, BlogCategoryAdminViewSet, BlogRegionAdminViewSet
from .blog_importer import BlogFullImportView, BlogFullImportDetailView

__all__ = [
    "RegionAdminViewSet",
    "TrekAdminViewSet",
    "FullImportView",
    "BlogAdminViewSet",
    "BlogCategoryAdminViewSet",
    "BlogRegionAdminViewSet",
    "BlogAuthorAdminViewSet",
    "BlogFullImportView",
    "BlogFullImportDetailView",
]
