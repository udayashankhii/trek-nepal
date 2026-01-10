from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from blog.blog.models import Author, BlogPost, Category, Region

User = get_user_model()


class BlogCategoryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class BlogRegionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ["id", "name", "slug"]


class BlogAuthorMiniSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.URLField(source="avatar_url", required=False, allow_blank=True)

    class Meta:
        model = Author
        fields = ["id", "name", "slug", "role", "avatarUrl", "description"]


class BlogCategoryAdminSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "isActive",
            "order",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = ["id", "createdAt", "updatedAt"]


class BlogRegionAdminSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Region
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "isActive",
            "order",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = ["id", "createdAt", "updatedAt"]


class BlogAuthorAdminSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
        required=False,
        allow_null=True,
    )
    avatarUrl = serializers.URLField(source="avatar_url", required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Author
        fields = [
            "id",
            "userId",
            "name",
            "slug",
            "role",
            "avatarUrl",
            "description",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = ["id", "createdAt", "updatedAt"]


class BlogAdminSerializer(serializers.ModelSerializer):
    # Relations
    category = BlogCategoryMiniSerializer(read_only=True)
    region = BlogRegionMiniSerializer(read_only=True)
    author = BlogAuthorMiniSerializer(read_only=True)

    categoryId = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    regionId = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source="region",
        write_only=True,
        required=False,
        allow_null=True,
    )
    authorId = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        source="author",
        write_only=True,
        required=False,
        allow_null=True,
    )
    categorySlug = serializers.SlugField(write_only=True, required=False, allow_blank=True)
    regionSlug = serializers.SlugField(write_only=True, required=False, allow_blank=True)
    authorSlug = serializers.SlugField(write_only=True, required=False, allow_blank=True)

    # CamelCase mappings
    contentType = serializers.CharField(source="content_type")
    metaTitle = serializers.CharField(source="meta_title", required=False, allow_blank=True)
    metaDescription = serializers.CharField(source="meta_description", required=False, allow_blank=True)
    publishDate = serializers.DateTimeField(source="publish_date")
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    lastReviewedAt = serializers.DateTimeField(source="last_reviewed_at", required=False, allow_null=True)
    readTime = serializers.IntegerField(source="read_time", required=False)
    canonicalUrl = serializers.URLField(source="canonical_url", required=False, allow_blank=True)
    featuredImage = serializers.JSONField(source="featured_image", required=False)
    imageFile = serializers.ImageField(source="image_file", required=False, allow_null=True)
    featuredImageFile = serializers.ImageField(source="featured_image_file", required=False, allow_null=True)
    contentSettings = serializers.JSONField(source="content_settings", required=False)
    relatedPosts = serializers.JSONField(source="related_posts", required=False)

    isFeatured = serializers.BooleanField(source="is_featured", required=False)
    allowComments = serializers.BooleanField(source="allow_comments", required=False)
    isLiked = serializers.BooleanField(source="is_liked", required=False)
    isBookmarked = serializers.BooleanField(source="is_bookmarked", required=False)

    engagement = serializers.SerializerMethodField()
    flags = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "status",
            "type",
            "contentType",
            "language",
            "slug",
            "title",
            "subtitle",
            "metaTitle",
            "metaDescription",
            "description",
            "excerpt",
            "category",
            "region",
            "author",
            "categoryId",
            "regionId",
            "authorId",
            "categorySlug",
            "regionSlug",
            "authorSlug",
            "publishDate",
            "updatedAt",
            "createdAt",
            "lastReviewedAt",
            "readTime",
            "difficulty",
            "canonicalUrl",
            "image",
            "imageFile",
            "featuredImage",
            "featuredImageFile",
            "images",
            "taxonomies",
            "contentSettings",
            "toc",
            "content",
            "cta",
            "links",
            "relatedPosts",
            "seo",
            "schema",
            "social",
            "editorial",
            "views",
            "likes",
            "shares",
            "isFeatured",
            "allowComments",
            "isLiked",
            "isBookmarked",
            "engagement",
            "flags",
        ]
        read_only_fields = ["id", "createdAt", "updatedAt", "engagement", "flags"]

    def get_engagement(self, obj):
        return {"views": int(obj.views), "likes": int(obj.likes), "shares": int(obj.shares)}

    def get_flags(self, obj):
        return {
            "isFeatured": bool(obj.is_featured),
            "allowComments": bool(obj.allow_comments),
            "isLiked": bool(obj.is_liked),
            "isBookmarked": bool(obj.is_bookmarked),
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["categorySlug"] = instance.category.slug if instance.category else ""
        data["regionSlug"] = instance.region.slug if instance.region else ""
        data["authorSlug"] = instance.author.slug if instance.author else ""
        return data

    def _get_or_create_taxonomy(self, model, slug: str):
        if not slug:
            return None
        obj = model.objects.filter(slug=slug).first()
        if obj:
            return obj
        return model.objects.create(name=slug.replace("-", " ").title(), slug=slug)

    def validate(self, attrs):
        category_slug = attrs.pop("categorySlug", "")
        region_slug = attrs.pop("regionSlug", "")
        author_slug = attrs.pop("authorSlug", "")

        if category_slug and "category" not in attrs:
            attrs["category"] = self._get_or_create_taxonomy(Category, category_slug)
        if region_slug and "region" not in attrs:
            attrs["region"] = self._get_or_create_taxonomy(Region, region_slug)
        if author_slug and "author" not in attrs:
            author = Author.objects.filter(slug=author_slug).first()
            if not author:
                author = Author.objects.create(
                    name=author_slug.replace("-", " ").title(),
                    slug=author_slug,
                )
            attrs["author"] = author

        # Allow engagement/flags input to update fields.
        engagement = self.initial_data.get("engagement") if hasattr(self, "initial_data") else None
        if isinstance(engagement, dict):
            attrs.setdefault("views", engagement.get("views"))
            attrs.setdefault("likes", engagement.get("likes"))
            attrs.setdefault("shares", engagement.get("shares"))

        flags = self.initial_data.get("flags") if hasattr(self, "initial_data") else None
        if isinstance(flags, dict):
            attrs.setdefault("is_featured", flags.get("isFeatured"))
            attrs.setdefault("allow_comments", flags.get("allowComments"))
            attrs.setdefault("is_liked", flags.get("isLiked"))
            attrs.setdefault("is_bookmarked", flags.get("isBookmarked"))

        return attrs


class BlogFullAdminSerializer(BlogAdminSerializer):
    pass
