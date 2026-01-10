import React, { useState, useCallback } from 'react';
import { 
  CalendarIcon, 
  EyeIcon, 
  ClockIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const FeaturedPost = ({ 
  post, 
  onClick, 
  onLike, 
  onBookmark, 
  currentUser 
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (!currentUser || !onLike) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await onLike(post.id, newLikedState);
    } catch (error) {
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

  const handleShare = useCallback(async (e) => {
    e.stopPropagation();
    

    const shareUrl = `${window.location.origin}/blog/${post.slug || post.id}`;
    const shareLinks =
      post.shareLinks && typeof post.shareLinks === "object"
        ? post.shareLinks
        : null;

    if (shareLinks?.facebook) {
      window.open(shareLinks.facebook, "_blank", "width=600,height=400");
      return;
    }



    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.metaDescription || post.description,
          url: `${window.location.origin}/blog/${post.slug || post.id}`
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug || post.id}`);
        // You could show a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  }, [post]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <article
      className="featured-post-card group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 mb-8 lg:mb-16"
      data-aos="fade-up"
      onClick={() => onClick && onClick(post)}
    >
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={post.featuredImage?.url || post.image}
            alt={post.featuredImage?.alt || post.title}
            className="w-full h-64 md:h-80 lg:h-96 object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
              Featured
            </span>
            {post.difficulty && (
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                post.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                post.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {post.difficulty}
              </span>
            )}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <div className="space-y-4 md:space-y-6 p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {formatDate(post.publishDate || post.date)}
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {post.views || '1.2k views'}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {post.readTime || 5} min read
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h2>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {post.metaDescription || post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              {currentUser && (
                <>
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{likeCount}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-orange-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Read Full Story
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
