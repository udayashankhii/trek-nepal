

import React, { useState, useCallback } from 'react';
import { 
  ClockIcon, 
  MapPinIcon, 
  CalendarIcon,
  ArrowRightIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const BlogCard = ({ 
  post, 
  index, 
  onClick,
  onLike,
  onBookmark,
  currentUser 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleCardClick = useCallback(() => {
    if (onClick) {
      onClick(post);
    }
  }, [onClick, post]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (!currentUser || !onLike) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await onLike(post.id, newLikedState);
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount(prev => newLikedState ? prev - 1 : prev + 1);
      console.error('Failed to update like:', error);
    }
  }, [isLiked, currentUser, onLike, post.id]);

  const handleBookmark = useCallback(async (e) => {
    e.stopPropagation();
    if (!currentUser || !onBookmark) return;
    
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    try {
      await onBookmark(post.id, newBookmarkedState);
    } catch (error) {
      setIsBookmarked(!newBookmarkedState);
      console.error('Failed to update bookmark:', error);
    }
  }, [isBookmarked, currentUser, onBookmark, post.id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <article
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-2xl overflow-hidden border border-gray-100"
      data-aos="fade-up"
      data-aos-delay={index * 100}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
          </div>
        )}

        {!imageError ? (
          <img
            src={post.featuredImage?.url || post.image}
            alt={post.featuredImage?.alt || post.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <div className="text-orange-400 text-4xl">🏔️</div>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
            {post.category}
          </span>
        </div>

        {/* Difficulty Badge */}
        {post.difficulty && (
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              post.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              post.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {post.difficulty}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <CalendarIcon className="w-3 h-3" />
            <span className="font-medium">{formatDate(post.publishDate || post.date)}</span>
          </div>
          
          {post.region && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <MapPinIcon className="w-3 h-3" />
                <span className="font-medium">{post.region}</span>
              </div>
            </>
          )}
          
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <ClockIcon className="w-3 h-3" />
            <span className="font-medium">{post.readTime || 5} min read</span>
          </div>

          {post.views && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <EyeIcon className="w-3 h-3" />
                <span className="font-medium">{post.views}</span>
              </div>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
          {post.metaDescription || post.description}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 text-xs text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-md">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {currentUser && (
              <>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  aria-label={isLiked ? 'Unlike post' : 'Like post'}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                  <span className="font-medium">{likeCount}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                >
                  {isBookmarked ? (
                    <BookmarkSolidIcon className="w-4 h-4 text-orange-500" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 font-medium">
                {post.difficulty || 'Moderate'} Trek
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors duration-300">
            Read more →
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
