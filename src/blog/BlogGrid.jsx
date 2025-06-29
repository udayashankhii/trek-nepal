import React, { useCallback, useState } from "react";
import BlogCard from "./BlogCard";
import FeaturedPost from "./FeaturedPost";

const BlogGrid = ({ 
  posts = [], 
  loading = false, 
  loadMore, 
  hasMore = false, 
  onPostClick,
  onLike,
  onBookmark,
  currentUser,
  error = null,
  onRetry
}) => {
  const [viewMode, setViewMode] = useState('grid');

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && loadMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  // Error State
  if (error && posts.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  // Empty State
  if (!loading && posts.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No stories available
          </h3>
          <p className="text-gray-600">
            Check back soon for exciting new adventure stories!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Latest Adventures
          </h2>
          <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <FeaturedPost 
            post={posts[0]} 
            onClick={onPostClick}
            onLike={onLike}
            onBookmark={onBookmark}
            currentUser={currentUser}
          />
        )}

        {/* Posts Grid/List */}
        {posts.length > 1 && (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8' 
              : 'space-y-6'
            } mt-8 md:mt-16
          `}>
            {posts.slice(1).map((post, index) => (
              <BlogCard 
                key={post.id || post.slug || index} 
                post={post} 
                index={index} 
                onClick={onPostClick}
                onLike={onLike}
                onBookmark={onBookmark}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading amazing adventures...</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-up"
            >
              Load More Adventures
            </button>
          </div>
        )}

        {/* No More Posts Message */}
        {!hasMore && posts.length > 0 && !loading && (
          <div className="text-center mt-8 text-gray-500">
            <p>You've reached the end of our adventures. Check back soon for more!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
