from django.contrib import admin

from travel_styles.models import TravelStyle


@admin.register(TravelStyle)
class TravelStyleAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published", "order", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("name", "slug", "description")
    ordering = ("order", "name")
    readonly_fields = ("created_at", "updated_at")
