from django.contrib import admin

from .models import CustomizeTripRequest


@admin.register(CustomizeTripRequest)
class CustomizeTripRequestAdmin(admin.ModelAdmin):
    list_display = (
        "request_ref",
        "trip_name",
        "contact_name",
        "status",
        "created_at",
    )
    list_filter = ("status", "accommodation", "porter_preference", "date_flexibility")
    search_fields = ("request_ref", "trip_name", "contact_name", "contact_email")
    readonly_fields = ("public_id", "request_ref", "created_at", "updated_at")
    ordering = ("-created_at",)
    fieldsets = (
        ("Trip information", {"fields": ("trip_slug", "trip_name", "preferred_region", "preferred_start_date", "date_flexibility", "duration_days")}),
        ("Group & services", {"fields": ("adults", "children", "private_trip", "accommodation", "transport", "guide_required", "porter_preference", "add_ons")}),
        ("Contact", {"fields": ("contact_name", "contact_email", "contact_phone", "contact_country", "fitness_level", "budget", "consent_to_contact")}),
        ("Administrative", {"fields": ("status", "special_requests", "origin_url", "source", "metadata", "public_id", "request_ref", "created_at", "updated_at")}),
    )
