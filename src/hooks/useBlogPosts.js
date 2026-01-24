// hooks/useBlogPosts.js
import { useState, useEffect } from "react";
import { fetchBlogPosts } from "../api/service/blogService";

export const useBlogPosts = (category = "all", page = 1) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPosts({ category, page });
        
        if (mounted) {
          setPosts(data.results || data);
          setPagination({
            count: data.count,
            next: data.next,
            previous: data.previous,
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load blog posts");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, [category, page]);

  return { posts, pagination, loading, error };
};

// hooks/useBlogPost.js
import { useState, useEffect } from "react";
import { fetchBlogPostBySlug, incrementPostViews } from "../api/blogService";

export const useBlogPost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPostBySlug(slug);
        
        if (mounted) {
          setPost(data);
          // Increment view count (non-blocking)
          incrementPostViews(slug);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load blog post");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return { post, loading, error };
};
