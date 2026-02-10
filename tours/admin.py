from django.contrib import admin

from .models import HomeFeaturedTour


@admin.register(HomeFeaturedTour)
class HomeFeaturedTourAdmin(admin.ModelAdmin):
    list_display = ("__str__", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("tour__title", "trek__title", "tour__slug", "trek__slug")
    ordering = ("order", "tour__title")
