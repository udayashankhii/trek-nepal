import React from "react";
import BlogCard from "./BlogCard";
import { CalendarIcon, EyeIcon } from "@heroicons/react/24/outline";
import BlogCard from "./BlogCard";
// Featured Post Component
const FeaturedPost = ({ post }) => {
  return (
    <article
      className="featured-post-card group cursor-pointer"
      data-aos="fade-up"
    >
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 lg:h-96 object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span className="category-badge featured">Featured</span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
            <span className="category-badge">{post.category}</span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {post.views}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h2>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-600">{post.author.role}</p>
              </div>
            </div>

            <button className="read-more-btn">Read Full Story</button>
          </div>
        </div>
      </div>
    </article>
  );
};

// Blog Grid Component
const BlogGrid = ({ posts, loading, loadMore, hasMore }) => {
  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Featured Post */}
        {posts.length > 0 && <FeaturedPost post={posts[0]} />}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-16">
          {posts.slice(1).map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="load-more-btn"
              data-aos="fade-up"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner" />
                  Loading more stories...
                </div>
              ) : (
                "Load More Adventures"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
