from rest_framework import generics, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, Category, Tag
from .serializers import (
    BlogPostListSerializer, BlogPostDetailSerializer,
    CategorySerializer, TagSerializer
)

class BlogPostListAPIView(generics.ListAPIView):
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'featured', 'region']
    search_fields = ['title', 'excerpt', 'content', 'category__name', 'tags__name', 'author__display_name']
    ordering_fields = ['published_at', 'views']
    ordering = ['-published_at']

class BlogPostDetailAPIView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TagListAPIView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

@api_view(['POST'])
def increment_views(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug)
        post.views += 1
        post.save()
        return Response({'views': post.views}, status=status.HTTP_200_OK)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
