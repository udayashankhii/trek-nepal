# blog/admin.py
from __future__ import annotations

import json

from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.html import format_html
from django.utils.text import Truncator

from .models import Author, BlogPost, BlogPostSlugHistory, Category, Region


# -----------------------------
# Widgets / Forms
# -----------------------------
class PrettyJSONWidget(forms.Textarea):
    """
    Simple JSON editor widget (no extra dependency).
    Shows pretty JSON in Django admin.
    """
    def format_value(self, value):
        if value in (None, "", {} , []):
            return ""
        try:
            return json.dumps(value, indent=2, ensure_ascii=False)
        except Exception:
            return super().format_value(value)


class BlogPostAdminForm(forms.ModelForm):
    """
    Adds validation + nicer JSON editing for JSONFields.
    """
    class Meta:
        model = BlogPost
        fields = "__all__"
        widgets = {
            "featured_image": PrettyJSONWidget(attrs={"rows": 6}),
            "images": PrettyJSONWidget(attrs={"rows": 8}),
            "taxonomies": PrettyJSONWidget(attrs={"rows": 10}),
            "content_settings": PrettyJSONWidget(attrs={"rows": 10}),
            "toc": PrettyJSONWidget(attrs={"rows": 10}),
            "content": PrettyJSONWidget(attrs={"rows": 18}),
            "cta": PrettyJSONWidget(attrs={"rows": 8}),
            "links": PrettyJSONWidget(attrs={"rows": 10}),
            "related_posts": PrettyJSONWidget(attrs={"rows": 8}),
            "seo": PrettyJSONWidget(attrs={"rows": 16}),
            "schema": PrettyJSONWidget(attrs={"rows": 16}),
            "social": PrettyJSONWidget(attrs={"rows": 12}),
            "editorial": PrettyJSONWidget(attrs={"rows": 10}),
        }

    def clean(self):
        data = super().clean()

        # If TOC disabled, enforce toc=[]
        content_settings = data.get("content_settings") or {}
        toc_enabled = bool(content_settings.get("tocEnabled", True))
        if not toc_enabled:
            data["toc"] = []

        # Optional: enforce valid JSON-LD shape for schema
        schema = data.get("schema") or {}
        if schema and not isinstance(schema, dict):
            raise ValidationError({"schema": "Schema must be a JSON object."})

        return data


# -----------------------------
# Inlines
# -----------------------------
class BlogPostSlugHistoryInline(admin.TabularInline):
    model = BlogPostSlugHistory
    extra = 0
    fields = ("old_slug", "new_slug", "redirect_count", "created_at", "updated_at")
    readonly_fields = ("redirect_count", "created_at", "updated_at")
    show_change_link = True


# -----------------------------
# Actions
# -----------------------------
@admin.action(description="Publish selected posts")
def action_publish(modeladmin, request, queryset):
    queryset.update(status=BlogPost.Status.PUBLISHED)


@admin.action(description="Unpublish selected posts (set to draft)")
def action_unpublish(modeladmin, request, queryset):
    queryset.update(status=BlogPost.Status.DRAFT)


@admin.action(description="Mark selected posts as featured")
def action_feature(modeladmin, request, queryset):
    queryset.update(is_featured=True)


@admin.action(description="Remove featured flag from selected posts")
def action_unfeature(modeladmin, request, queryset):
    queryset.update(is_featured=False)


# -----------------------------
# Category / Region / Author
# -----------------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "order", "created_at", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "order", "created_at", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "role", "description_short", "user", "created_at", "updated_at")
    search_fields = ("name", "slug", "role", "description", "user__email", "user__username")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")

    @admin.display(description="Description")
    def description_short(self, obj: Author) -> str:
        return Truncator(obj.description or "").chars(60)


# -----------------------------
# BlogPost Admin
# -----------------------------
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm

    actions = [action_publish, action_unpublish, action_feature, action_unfeature]

    date_hierarchy = "publish_date"
    list_display = (
        "title_short",
        "slug",
        "status",
        "language",
        "type",
        "content_type",
        "category",
        "category_slug",
        "region",
        "author",
        "is_featured",
        "publish_date",
        "views",
        "likes",
        "shares",
        "updated_at",
    )
    list_filter = (
        "status",
        "language",
        "type",
        "content_type",
        "is_featured",
        "category",
        "region",
    )
    search_fields = (
        "title",
        "subtitle",
        "slug",
        "meta_title",
        "meta_description",
        "excerpt",
        "description",
        "category__name",
        "region__name",
        "author__name",
    )
    list_editable = ("status", "is_featured")
    ordering = ("-publish_date", "-id")

    autocomplete_fields = ("category", "region", "author")
    prepopulated_fields = {"slug": ("title",)}

    readonly_fields = (
        "created_at",
        "updated_at",
        "views",
        "likes",
        "shares",
        "preview_featured_image",
        "preview_card_image",
    )

    inlines = [BlogPostSlugHistoryInline]

    fieldsets = (
        ("Publishing", {
            "fields": (
                ("status", "language", "type", "content_type"),
                ("publish_date", "last_reviewed_at"),
                ("is_featured", "allow_comments"),
            )
        }),
        ("Core Content", {
            "fields": (
                "slug",
                "title",
                "subtitle",
                ("category", "region", "author"),
                ("excerpt",),
                ("description",),
            )
        }),
        ("SEO Basics", {
            "fields": (
                "meta_title",
                "meta_description",
                "canonical_url",
                "taxonomies",
            )
        }),
        ("Images", {
            "fields": (
                ("image", "image_file", "preview_card_image"),
                ("featured_image", "featured_image_file", "preview_featured_image"),
                "images",
            )
        }),
        ("Editor / Body", {
            "fields": (
                "content_settings",
                "toc",
                "content",
            )
        }),
        ("Links / CTA / Social", {
            "fields": (
                "cta",
                "links",
                "related_posts",
                "social",
            )
        }),
        ("Advanced SEO (OpenGraph/Twitter/Robots)", {
            "fields": (
                "seo",
            )
        }),
        ("Structured Data (JSON-LD)", {
            "fields": (
                "schema",
            )
        }),
        ("Editorial & Analytics", {
            "fields": (
                "editorial",
                ("views", "likes", "shares"),
                ("created_at", "updated_at"),
            )
        }),
    )

    # ----- nice display helpers -----
    @admin.display(description="Title")
    def title_short(self, obj: BlogPost) -> str:
        return Truncator(obj.title).chars(60)

    @admin.display(description="Category Slug")
    def category_slug(self, obj: BlogPost) -> str:
        if not obj.category:
            return "—"
        return obj.category.slug

    @admin.display(description="Card Image")
    def preview_card_image(self, obj: BlogPost) -> str:
        if not obj.image:
            return "—"
        return format_html('<img src="{}" style="height:52px;border-radius:8px;object-fit:cover;" />', obj.image)

    @admin.display(description="Featured Image")
    def preview_featured_image(self, obj: BlogPost) -> str:
        url = (obj.featured_image or {}).get("url") or ""
        if not url:
            return "—"
        return format_html('<img src="{}" style="height:72px;border-radius:10px;object-fit:cover;" />', url)

    def get_queryset(self, request):
        # Faster admin listing
        qs = super().get_queryset(request)
        return qs.select_related("category", "region", "author")


# -----------------------------
# Slug History Admin (optional)
# -----------------------------
@admin.register(BlogPostSlugHistory)
class BlogPostSlugHistoryAdmin(admin.ModelAdmin):
    list_display = ("post", "old_slug", "new_slug", "redirect_count", "created_at", "updated_at")
    search_fields = ("old_slug", "new_slug", "post__title", "post__slug")
    list_filter = ("created_at",)
    readonly_fields = ("redirect_count", "created_at", "updated_at")
