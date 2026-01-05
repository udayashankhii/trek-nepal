from django.db import models
from django.contrib.auth import get_user_model
from autoslug import AutoSlugField

User = get_user_model()

# Author Model
class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blog_author', null=True, blank=True)
    display_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='author_avatars/', blank=True, null=True)

    def __str__(self):
        return self.display_name

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    slug = AutoSlugField(populate_from='name', unique=True)

    def __str__(self):
        return self.name

# Tag Model
class Tag(models.Model):
    name = models.CharField(max_length=32, unique=True)
    slug = AutoSlugField(populate_from='name', unique=True)

    def __str__(self):
        return self.name

# BlogPost Model
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = AutoSlugField(populate_from='title', unique=True)
    excerpt = models.TextField(max_length=400)
    content = models.TextField()
    featured = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to='blog_covers/')
    og_image = models.ImageField(upload_to='blog_og_images/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, related_name='posts')
    published = models.BooleanField(default=False)
    published_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    reading_time = models.PositiveIntegerField(default=5)
    region = models.CharField(max_length=64, blank=True)
    views = models.PositiveIntegerField(default=0)
    meta_description = models.CharField(max_length=160, blank=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title
