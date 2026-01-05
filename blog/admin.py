from django.contrib import admin
from .models import BlogPost, Category, Tag, Author

# Direct Inline Tag model
class TagInline(admin.StackedInline):
    model = BlogPost.tags.through  # Many-to-Many relation
    extra = 1
    verbose_name = "Add Tag"
    verbose_name_plural = "Tags"

class AuthorAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user']
    search_fields = ['display_name']
    autocomplete_fields = ['user']

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ['name']

class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ['name']

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'featured', 'published', 'published_at', 'views']
    list_filter = ['category', 'featured', 'published', 'author', 'tags', 'region']
    search_fields = ['title', 'excerpt', 'content', 'author__display_name']
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ['author', 'category']
    readonly_fields = ['views', 'updated_at']
    inlines = [TagInline]

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'cover_image', 'og_image')
        }),
        ('SEO & Meta', {
            'fields': ('meta_description', 'reading_time', 'region', 'featured', 'published')
        }),
        ('Author & Category', {
            'fields': ('author', 'category')
        }),
        ('Publishing', {
            'fields': ('published_at', 'updated_at')
        }),
        ('Analytics', {
            'fields': ('views',)
        }),
    )

admin.site.register(Author, AuthorAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(BlogPost, BlogPostAdmin)
