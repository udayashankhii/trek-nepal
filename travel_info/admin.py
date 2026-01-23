from django.contrib import admin

from .models import TravelInfoPage


@admin.register(TravelInfoPage)
class TravelInfoPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "summary")
