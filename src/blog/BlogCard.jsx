import React from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

const BlogCard = ({ post, index }) => {
  return (
    <article
      className="blog-card group cursor-pointer"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="category-badge">{post.category}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-3 h-3" />
            {post.location}
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {post.author.name}
            </span>
          </div>

          <span className="text-xs text-gray-500">
            {post.readTime} min read
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
