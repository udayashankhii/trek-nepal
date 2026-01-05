# admin_api/permissions.py
from rest_framework.permissions import BasePermission


class IsStaff(BasePermission):
    """
    Allows access only to authenticated staff users.
    Use this for your Admin Panel APIs.
    """
    message = "You do not have permission to access this admin API."

    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and user.is_staff)


class IsSuperUser(BasePermission):
    """
    Stricter permission: only superusers.
    Useful for dangerous endpoints (bulk delete, reset, etc.).
    """
    message = "Only superusers can access this endpoint."

    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and user.is_superuser)
