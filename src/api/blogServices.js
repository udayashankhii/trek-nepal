// src/api/blogService.js
import axiosInstance from "./axiosInstance";

// ============================================
// BLOG POST CACHE (Longer TTL for static content)
// ============================================
const blogCache = new Map();
const BLOG_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedBlog = (key) => {
  const cached = blogCache.get(key);
  if (cached && Date.now() - cached.timestamp < BLOG_CACHE_DURATION) {
    return cached.data;
  }
  blogCache.delete(key);
  return null;
};

const setCachedBlog = (key, data) => {
  blogCache.set(key, { data, timestamp: Date.now() });
};

/**
 * Clear blog cache (call when content is updated)
 */
export const clearBlogCache = () => {
  blogCache.clear();
};

// ============================================
// BLOG POST APIs
// ============================================

/**
 * Fetch blog posts with pagination and filtering
 * @param {Object} options - Fetch options
 * @param {string} options.category - Category slug filter
 * @param {string} options.pageUrl - Direct pagination URL (overrides other params)
 * @param {number} options.page - Page number
 * @param {number} options.pageSize - Items per page
 * @param {string} options.search - Search query
 * @param {boolean} useCache - Use cached data if available
 * @returns {Promise<Object>} Paginated blog posts response
 */
export const fetchBlogPosts = async (
  { category, pageUrl, page, pageSize = 10, search } = {},
  useCache = true
) => {
  try {
    // Handle direct pagination URL (e.g., next/previous links)
    if (pageUrl) {
      const cacheKey = `blog_url_${pageUrl}`;
      
      if (useCache) {
        const cached = getCachedBlog(cacheKey);
        if (cached) return cached;
      }

      // Extract path from full URL
      const url = new URL(pageUrl);
      const path = url.pathname.replace("/api/", "") + url.search;
      
      const response = await axiosInstance.get(path);
      setCachedBlog(cacheKey, response.data);
      return response.data;
    }

    // Build cache key from parameters
    const cacheKey = `blog_posts_${category || "all"}_${page || 1}_${search || ""}_${pageSize}`;

    if (useCache) {
      const cached = getCachedBlog(cacheKey);
      if (cached) return cached;
    }

    // Build query parameters
    const params = { page_size: pageSize };
    if (category && category !== "all") params.category = category;
    if (page) params.page = page;
    if (search) params.search = search;

    const response = await axiosInstance.get("blog/posts/", { params });
    setCachedBlog(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

/**
 * Fetch a single blog post by slug
 * @param {string} slug - Blog post slug
 * @param {boolean} useCache - Use cached data if available
 * @returns {Promise<Object>} Blog post details
 */
export const fetchBlogPostBySlug = async (slug, useCache = true) => {
  const cacheKey = `blog_post_${slug}`;

  if (useCache) {
    const cached = getCachedBlog(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get(`blog/posts/${slug}/`);
    setCachedBlog(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch all blog categories
 * @param {boolean} useCache - Use cached data if available
 * @returns {Promise<Array>} List of blog categories
 */
export const fetchBlogCategories = async (useCache = true) => {
  const cacheKey = "blog_categories";

  if (useCache) {
    const cached = getCachedBlog(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get("blog/categories/");
    const categories = response.data.results || response.data;
    setCachedBlog(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
};

/**
 * Fetch featured blog posts
 * @param {number} limit - Number of featured posts to fetch
 * @param {boolean} useCache - Use cached data if available
 * @returns {Promise<Array>} Featured blog posts
 */
export const fetchFeaturedPosts = async (limit = 3, useCache = true) => {
  const cacheKey = `blog_featured_${limit}`;

  if (useCache) {
    const cached = getCachedBlog(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get("blog/posts/featured/", {
      params: { limit },
    });
    const posts = response.data.results || response.data;
    setCachedBlog(cacheKey, posts);
    return posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }
};

/**
 * Fetch related blog posts
 * @param {string} slug - Current blog post slug
 * @param {number} limit - Number of related posts
 * @param {boolean} useCache - Use cached data if available
 * @returns {Promise<Array>} Related blog posts
 */
export const fetchRelatedPosts = async (slug, limit = 3, useCache = true) => {
  const cacheKey = `blog_related_${slug}_${limit}`;

  if (useCache) {
    const cached = getCachedBlog(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get(`blog/posts/${slug}/related/`, {
      params: { limit },
    });
    const posts = response.data.results || response.data;
    setCachedBlog(cacheKey, posts);
    return posts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return []; // Return empty array on error for related posts
  }
};

/**
 * Search blog posts
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Search results
 */
export const searchBlogPosts = async (query, filters = {}) => {
  try {
    const params = { search: query, ...filters };
    const response = await axiosInstance.get("blog/posts/search/", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching blog posts:", error);
    throw error;
  }
};

/**
 * Fetch blog posts by category slug
 * @param {string} categorySlug - Category slug
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise<Object>} Paginated posts in category
 */
export const fetchPostsByCategory = async (
  categorySlug,
  page = 1,
  pageSize = 10
) => {
  return fetchBlogPosts({ category: categorySlug, page, pageSize });
};

/**
 * Fetch blog post by ID (alternative to slug)
 * @param {number} postId - Blog post ID
 * @returns {Promise<Object>} Blog post details
 */
export const fetchBlogPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`blog/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post ${postId}:`, error);
    throw error;
  }
};

/**
 * Increment blog post view count
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object>} Updated view count
 */
export const incrementPostViews = async (slug) => {
  try {
    const response = await axiosInstance.post(`blog/posts/${slug}/view/`);
    return response.data;
  } catch (error) {
    console.error("Error incrementing post views:", error);
    // Don't throw error for analytics - fail silently
    return null;
  }
};

/**
 * Like/unlike a blog post (if implemented)
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object>} Like status
 */
export const togglePostLike = async (slug) => {
  try {
    const response = await axiosInstance.post(`blog/posts/${slug}/like/`);
    return response.data;
  } catch (error) {
    console.error("Error toggling post like:", error);
    throw error;
  }
};
