from django.contrib import admin

from .models import (
    AboutCTA,
    AboutDocument,
    AboutFeature,
    AboutMilestone,
    AboutPage,
    AboutPolicySection,
    AboutStat,
    AboutStep,
    AboutTeamMember,
    AboutTestimonial,
)


class AboutStatInline(admin.TabularInline):
    model = AboutStat
    extra = 0


class AboutFeatureInline(admin.TabularInline):
    model = AboutFeature
    extra = 0


class AboutTeamInline(admin.TabularInline):
    model = AboutTeamMember
    extra = 0


class AboutDocumentInline(admin.TabularInline):
    model = AboutDocument
    extra = 0


class AboutStepInline(admin.TabularInline):
    model = AboutStep
    extra = 0


class AboutPolicyInline(admin.TabularInline):
    model = AboutPolicySection
    extra = 0


class AboutTestimonialInline(admin.TabularInline):
    model = AboutTestimonial
    extra = 0


class AboutMilestoneInline(admin.TabularInline):
    model = AboutMilestone
    extra = 0


class AboutCTAInline(admin.TabularInline):
    model = AboutCTA
    extra = 0


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "summary")
    inlines = [
        AboutStatInline,
        AboutFeatureInline,
        AboutTeamInline,
        AboutDocumentInline,
        AboutStepInline,
        AboutPolicyInline,
        AboutTestimonialInline,
        AboutMilestoneInline,
        AboutCTAInline,
    ]
