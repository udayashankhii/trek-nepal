# TrekCard/admin.py
from django.contrib import admin
from django.utils.html import format_html
import nested_admin




from .models import (
    Region,TrekInfo, TrekOverview, TrekOverviewSection, TrekOverviewBullet,
    TrekItineraryDay, TrekHighlight, TrekAction, Cost,
    TrekDeparture, TrekGroupPrice, TrekDateHighlight, TrekCostAndDateSection,
    TrekFAQCategory, TrekFAQ, TrekGalleryImage, TrekHeroSection,
    TrekElevationChart, TrekElevationPoint, TrekBookingCard, TrekBookingGroupPrice,
    TrekAdditionalInfoSection, TrekAdditionalInfoBullet,
    SimilarTrek, TrekReview, ReviewSource,
)

# =========================================================
# Inlines (deepest → up)
# =========================================================
# ✅ FIXED RegionTrekInline
class RegionTrekInline(admin.TabularInline):
    """
    Show treks that belong to this region on the Region admin page.
    """
    model = TrekInfo
    fk_name = "region"  # tell Django which FK links TrekInfo -> Region
    fields = ("title", "slug", "duration", "trip_grade", "activity", "rating", "reviews")
    extra = 0
    show_change_link = True
    # ❌ REMOVE autocomplete_fields — trip_grade is a CharField, not FK/M2M


class TrekOverviewBulletInline(nested_admin.NestedTabularInline):
    model = TrekOverviewBullet
    extra = 1
    fields = ("text", "icon", "order")
    ordering = ("order",)


class TrekOverviewSectionInline(nested_admin.NestedStackedInline):
    model = TrekOverviewSection
    extra = 0
    show_change_link = True
    fields = ("heading", "articles", "order")
    ordering = ("order",)
    inlines = [TrekOverviewBulletInline]


class TrekOverviewInline(nested_admin.NestedStackedInline):
    model = TrekOverview
    extra = 0
    max_num = 1
    show_change_link = True
    inlines = [TrekOverviewSectionInline]


class TrekItineraryDayInline(nested_admin.NestedTabularInline):
    model = TrekItineraryDay
    extra = 1
    show_change_link = True
    fields = (
        "day",
        "title",
        "place_name",     # ✅ NEW
        "latitude",       # ✅ NEW
        "longitude",      # ✅ NEW
        "description",
        "accommodation",
        "altitude",
        "duration",
        "distance",
        "meals",
    )
    ordering = ("day",)



class TrekHighlightInline(nested_admin.NestedTabularInline):
    model = TrekHighlight
    extra = 1
    show_change_link = True
    fields = ("title", "description", "icon")



# --- Cost inline (1:1) ---
class CostInline(nested_admin.NestedStackedInline):
    model = Cost
    extra = 0
    max_num = 1
    show_change_link = True
    fields = ("title", "cost_inclusions", "cost_exclusions")

# --- TrekAction inline (1:1: PDF + Map) ---
class TrekActionInline(nested_admin.NestedStackedInline):
    model = TrekAction
    extra = 0
    max_num = 1
    show_change_link = True
    fields = ("pdf", "map_image")




class TrekDepartureInline(nested_admin.NestedTabularInline):
    model = TrekDeparture
    extra = 1
    fields = ("start", "end", "status", "price", "seats_left")
    ordering = ("start",)


class TrekGroupPriceInline(nested_admin.NestedTabularInline):
    model = TrekGroupPrice
    extra = 1
    fields = ("label", "price")
    ordering = ("price",)


class TrekDateHighlightInline(nested_admin.NestedTabularInline):
    model = TrekDateHighlight
    extra = 1
    fields = ("highlight",)


class TrekCostAndDateSectionInline(nested_admin.NestedStackedInline):
    model = TrekCostAndDateSection
    extra = 0
    max_num = 1
    show_change_link = True
    fields = ("intro_text",)


class TrekFAQInline(nested_admin.NestedTabularInline):
    model = TrekFAQ
    extra = 1
    show_change_link = True
    fields = ("question", "answer", "order")
    ordering = ("order", "id")


class TrekFAQCategoryInline(nested_admin.NestedStackedInline):
    model = TrekFAQCategory
    extra = 0
    show_change_link = True
    fields = ("title", "icon", "order")
    ordering = ("order", "id")
    inlines = [TrekFAQInline]


class TrekGalleryImageInline(nested_admin.NestedTabularInline):
    model = TrekGalleryImage
    extra = 1
    fields = ("image", "title", "caption", "order")
    ordering = ("order", "id")


class TrekHeroSectionInline(nested_admin.NestedStackedInline):
    model = TrekHeroSection
    extra = 0
    max_num = 1
    show_change_link = True
    fields = ("title", "subtitle", "image", "season", "duration", "difficulty", "location", "cta_label", "cta_link")


class TrekElevationPointInline(nested_admin.NestedTabularInline):
    model = TrekElevationPoint
    extra = 1
    fields = ("order", "day", "title", "elevation", "description")
    ordering = ("order", "day")


class TrekElevationChartInline(nested_admin.NestedStackedInline):
    model = TrekElevationChart
    extra = 0
    max_num = 1
    show_change_link = True
    fields = ("title", "subtitle", "background_image")
    inlines = [TrekElevationPointInline]


class TrekBookingGroupPriceInline(nested_admin.NestedTabularInline):
    model = TrekBookingGroupPrice
    extra = 1
    fields = ("min_size", "max_size", "price")
    ordering = ("min_size",)


class TrekBookingCardInline(nested_admin.NestedStackedInline):
    model = TrekBookingCard
    extra = 0
    max_num = 1
    show_change_link = True
    fields = (
        "base_price", "original_price", "pricing_mode", "badge_label",
        "secure_payment", "no_hidden_fees", "free_cancellation", "support_24_7", "trusted_reviews",
    )
    inlines = [TrekBookingGroupPriceInline]


class TrekAdditionalInfoBulletInline(nested_admin.NestedTabularInline):
    model = TrekAdditionalInfoBullet
    extra = 1
    fields = ("text", "icon", "order")
    ordering = ("order",)


class TrekAdditionalInfoSectionInline(nested_admin.NestedStackedInline):
    model = TrekAdditionalInfoSection
    extra = 0
    show_change_link = True
    fields = ("heading", "articles", "order")
    ordering = ("order",)
    inlines = [TrekAdditionalInfoBulletInline]


# --- NEW: Similar Trek inline (manual curation) ---
class SimilarTrekInline(nested_admin.NestedTabularInline):
    """
    Lets you pick specific “Similar Treks” for this trek.
    Falls back to auto-similar in the API if none are defined.
    """
    model = SimilarTrek
    fk_name = "trek"
    extra = 1
    autocomplete_fields = ("related_trek",)
    fields = ("related_trek", "order")
    ordering = ("order",)


# --- NEW: Trek Review inline ---
class TrekReviewInline(nested_admin.NestedTabularInline):
    model = TrekReview
    extra = 1
    fields = (
        "reviewer_name", "reviewer_country", "reviewer_avatar",
        "rating", "title", "body", "source", "is_published", "created_at",
    )
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    radio_fields = {"source": admin.HORIZONTAL}

# =========================================================
# Top-level ModelAdmins
# =========================================================

@admin.register(TrekInfo)
class TrekInfoAdmin(nested_admin.NestedModelAdmin):
    list_display = (
        "id", "title", "slug", "duration", "trip_grade", "start_point",
        "group_size", "max_altitude", "activity", "rating", "reviews", "created_at",
    )
    search_fields = ("title", "start_point", "activity", "slug")
    list_filter = ("trip_grade", "activity", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [

        TrekOverviewInline,
        TrekItineraryDayInline,
        TrekHighlightInline,
        CostInline,
        TrekActionInline,
        TrekDepartureInline,
        TrekGroupPriceInline,
        TrekDateHighlightInline,
        TrekCostAndDateSectionInline,
        TrekFAQCategoryInline,
        TrekGalleryImageInline,
        TrekHeroSectionInline,
        TrekElevationChartInline,
        TrekBookingCardInline,
        TrekAdditionalInfoSectionInline,
        # NEW:
        SimilarTrekInline,
        TrekReviewInline,
    ]


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "marker_x", "marker_y", "has_cover")
    list_editable = ("order",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [RegionTrekInline]

    fieldsets = (
        (None, {"fields": ("name", "slug", "short_label", "order")}),
        ("Menu Map (optional)", {"fields": ("marker_x", "marker_y")}),
        ("Presentation (optional)", {"fields": ("cover",)}),
    )

    def has_cover(self, obj):
        return bool(obj.cover)
    has_cover.boolean = True
    has_cover.short_description = "Cover?"


@admin.register(TrekOverview)
class TrekOverviewAdmin(nested_admin.NestedModelAdmin):
    list_display = ("id", "trek")
    search_fields = ("trek__title",)
    inlines = [TrekOverviewSectionInline]


@admin.register(TrekItineraryDay)
class TrekItineraryDayAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {"fields": ("trek", "day", "title", "description")}),
        ("Map Location", {"fields": ("place_name", "latitude", "longitude")}),
        ("Details", {"fields": ("accommodation", "altitude", "duration", "distance", "meals")}),
    )



@admin.register(TrekHighlight)
class TrekHighlightAdmin(admin.ModelAdmin):
    list_display = ("trek", "title", "icon")
    list_filter = ("trek", "icon")
    search_fields = ("trek__title", "title")


@admin.register(TrekAction)
class TrekActionAdmin(admin.ModelAdmin):
    list_display = ("trek", "pdf", "map_image")
    search_fields = ("trek__title",)
    fields = ("trek", "pdf", "map_image")


@admin.register(Cost)
class CostAdmin(admin.ModelAdmin):
    list_display = ("trek", "title", "short_inclusions", "short_exclusions")
    search_fields = ("title", "trek__title")

    def short_inclusions(self, obj):
        items = list(obj.cost_inclusions or [])
        preview = ", ".join(items[:2])
        return f"{preview}..." if len(items) > 2 else preview

    def short_exclusions(self, obj):
        items = list(obj.cost_exclusions or [])
        preview = ", ".join(items[:2])
        return f"{preview}..." if len(items) > 2 else preview

    short_inclusions.short_description = "Cost Inclusions"
    short_exclusions.short_description = "Cost Exclusions"

    fieldsets = (
        (None, {"fields": ("trek", "title")}),
        ("Trip Cost Details", {
            "fields": ("cost_inclusions", "cost_exclusions"),
            "description": "Use the [+] to add inclusions/exclusions (each item as a separate string).",
        }),
    )


@admin.register(TrekDeparture)
class TrekDepartureAdmin(admin.ModelAdmin):
    list_display = ("trek", "start", "end", "status", "price", "seats_left")
    list_filter = ("trek", "status")
    search_fields = ("trek__title",)
    ordering = ("start",)


@admin.register(TrekGroupPrice)
class TrekGroupPriceAdmin(admin.ModelAdmin):
    list_display = ("trek", "label", "price")
    list_filter = ("trek",)
    search_fields = ("trek__title", "label")
    ordering = ("trek", "price")


@admin.register(TrekDateHighlight)
class TrekDateHighlightAdmin(admin.ModelAdmin):
    list_display = ("trek", "highlight")
    search_fields = ("trek__title", "highlight")


@admin.register(TrekCostAndDateSection)
class TrekCostAndDateSectionAdmin(admin.ModelAdmin):
    list_display = ("trek", "intro_text")
    search_fields = ("trek__title",)


@admin.register(TrekFAQCategory)
class TrekFAQCategoryAdmin(nested_admin.NestedModelAdmin):
    list_display = ("trek", "title", "icon", "order")
    list_filter = ("trek", "icon")
    search_fields = ("trek__title", "title")
    ordering = ("trek", "order", "title")
    inlines = [TrekFAQInline]


@admin.register(TrekFAQ)
class TrekFAQAdmin(admin.ModelAdmin):
    list_display = ("category", "question", "order")
    list_filter = ("category",)
    search_fields = ("category__trek__title", "question")
    ordering = ("category", "order")


@admin.register(TrekGalleryImage)
class TrekGalleryImageAdmin(admin.ModelAdmin):
    list_display = ("trek", "title", "order", "image_thumb", "caption")
    list_filter = ("trek",)
    search_fields = ("trek__title", "title", "caption")
    ordering = ("trek", "order", "id")
    list_per_page = 30

    def image_thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', obj.image.url)
        return ""
    image_thumb.short_description = "Image"


@admin.register(TrekHeroSection)
class TrekHeroSectionAdmin(admin.ModelAdmin):
    list_display = ("trek", "title", "season", "duration", "difficulty", "location", "cta_label")
    search_fields = ("trek__title", "title", "subtitle")
    list_filter = ("season", "difficulty", "location")


@admin.register(TrekElevationChart)
class TrekElevationChartAdmin(nested_admin.NestedModelAdmin):
    list_display = ("trek", "title")
    search_fields = ("trek__title", "title")
    inlines = [TrekElevationPointInline]


@admin.register(TrekElevationPoint)
class TrekElevationPointAdmin(admin.ModelAdmin):
    list_display = ("chart", "day", "title", "elevation", "order")
    list_filter = ("chart",)
    search_fields = ("title", "description")
    ordering = ("chart", "order", "day")


@admin.register(TrekBookingCard)
class TrekBookingCardAdmin(nested_admin.NestedModelAdmin):
    list_display = ("trek", "base_price", "original_price", "pricing_mode", "badge_label")
    search_fields = ("trek__title",)
    list_filter = ("pricing_mode",)
    inlines = [TrekBookingGroupPriceInline]
    fieldsets = (
        (None, {"fields": ("trek", "base_price", "original_price", "pricing_mode", "badge_label")}),
        ("Trust Indicators", {
            "fields": ("secure_payment", "no_hidden_fees", "free_cancellation", "support_24_7", "trusted_reviews"),
        }),
    )


@admin.register(TrekBookingGroupPrice)
class TrekBookingGroupPriceAdmin(admin.ModelAdmin):
    list_display = ("booking", "min_size", "max_size", "price")
    list_filter = ("booking",)
    search_fields = ("booking__trek__title",)
    ordering = ("booking", "min_size")


@admin.register(TrekAdditionalInfoSection)
class TrekAdditionalInfoSectionAdmin(nested_admin.NestedModelAdmin):
    list_display = ("trek", "heading", "order")
    ordering = ("trek", "order")
    search_fields = ("trek__title", "heading")
    inlines = [TrekAdditionalInfoBulletInline]


@admin.register(TrekAdditionalInfoBullet)
class TrekAdditionalInfoBulletAdmin(admin.ModelAdmin):
    list_display = ("section", "text", "icon", "order")
    ordering = ("section", "order")
    search_fields = ("section__trek__title", "text")


# =========================================================
# Similar Trek & Reviews (top-level) 
# =========================================================

@admin.register(SimilarTrek)
class SimilarTrekAdmin(admin.ModelAdmin):
    list_display = ("trek", "related_trek", "order")
    list_filter = ("trek",)
    search_fields = ("trek__title", "related_trek__title")
    ordering = ("trek", "order")
    autocomplete_fields = ("trek", "related_trek")


@admin.register(TrekReview)
class TrekReviewAdmin(admin.ModelAdmin):
    list_display = ("trek", "reviewer_name", "reviewer_country", "rating", "source", "is_published", "created_at")
    list_filter = ("trek", "rating", "source", "is_published", "created_at")
    search_fields = ("trek__title", "reviewer_name", "reviewer_country", "title", "body")
    ordering = ("-created_at",)
    autocomplete_fields = ("trek",)
    radio_fields = {"source": admin.HORIZONTAL}
