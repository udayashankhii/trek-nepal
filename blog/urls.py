from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.BlogPostListAPIView.as_view(), name='blogpost-list'),
    path('posts/<slug:slug>/', views.BlogPostDetailAPIView.as_view(), name='blogpost-detail'),
    path('posts/<slug:slug>/increment-views/', views.increment_views, name='increment-views'),
    path('categories/', views.CategoryListAPIView.as_view(), name='category-list'),
    path('tags/', views.TagListAPIView.as_view(), name='tag-list'),
]
