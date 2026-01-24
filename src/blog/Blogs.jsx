
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BlogGrid from "./BlogGrid";
import BlogDetail from "./BlogDetails";
import {
  fetchBlogCategories,
  fetchBlogPostBySlug,
  fetchBlogPosts,
} from "../api/service/blogServices.js";

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Stories", icon: "📚" },
];

const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("trek")) return "🏔️";
  if (lower.includes("culture")) return "🏛️";
  if (lower.includes("wild")) return "🦌";
  if (lower.includes("gear")) return "🎒";
  if (lower.includes("tip")) return "💡";
  return "📝";
};

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const extractTextFromSpans = (spans = []) => {
  if (!Array.isArray(spans)) return "";
  return spans
    .map((span) => (span && span.text ? String(span.text) : ""))
    .join("")
    .trim();
};

const buildContentFromBlocks = (content = {}, description = "") => {
  const blocks = Array.isArray(content.blocks) ? content.blocks : [];
  const sections = [];
  const introParts = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    const hasContent =
      (current.content && current.content.trim()) ||
      (current.subsections && current.subsections.length);
    if (hasContent) {
      sections.push(current);
    }
  };

  blocks.forEach((block) => {
    const type = block?.type;

    if (type === "heading") {
      pushCurrent();
      const title = (block?.text || "").trim() || "Section";
      current = {
        id: block?.id || slugify(title),
        title,
        content: "",
        subsections: [],
      };
      return;
    }

    if (type === "paragraph" || type === "quote" || type === "callout") {
      const text =
        extractTextFromSpans(block?.spans) || (block?.text || "").trim();
      if (!text) return;
      if (!current) {
        introParts.push(text);
        return;
      }
      current.content = current.content
        ? `${current.content}\n\n${text}`
        : text;
      return;
    }

    if (type === "list") {
      const items = Array.isArray(block?.items)
        ? block.items.map((item) => String(item))
        : [];
      if (!items.length) return;
      if (!current) {
        current = {
          id: "highlights",
          title: "Highlights",
          content: "",
          subsections: [],
        };
      }
      current.subsections = [...(current.subsections || []), ...items];
      return;
    }

    if (type === "faq") {
      const items = Array.isArray(block?.items) ? block.items : [];
      if (!items.length) return;
      if (!current) {
        current = {
          id: "faq",
          title: "FAQ",
          content: "",
          subsections: [],
        };
      }
      const faqText = items
        .map((item) => {
          const q = (item?.q || "").trim();
          const a = (item?.a || "").trim();
          if (!q && !a) return "";
          if (q && a) return `Q: ${q}\nA: ${a}`;
          return q || a;
        })
        .filter(Boolean)
        .join("\n\n");
      current.content = current.content
        ? `${current.content}\n\n${faqText}`
        : faqText;
    }
  });

  pushCurrent();

  const introduction =
    introParts.join(" ") || description || "Welcome to this adventure.";

  if (!sections.length) {
    sections.push({
      id: "main-content",
      title: "Story",
      content: description || introduction,
      subsections: [],
    });
  }

  return { introduction, sections };
};

const normalizePost = (post = {}) => {
  const engagement = post.engagement || {};
  const flags = post.flags || {};
  const tags = Array.isArray(post.tags)
    ? post.tags
    : Array.isArray(post?.taxonomies?.tags)
      ? post.taxonomies.tags
      : [];

  let excerptFromBlocks = "";
  if (Array.isArray(post?.content?.blocks)) {
    for (const block of post.content.blocks) {
      if (block?.type !== "paragraph") {
        continue;
      }
      if (Array.isArray(block.spans)) {
        excerptFromBlocks = block.spans
          .map((span) => (span?.text ? span.text : ""))
          .join("")
          .trim();
      } else if (block?.text) {
        excerptFromBlocks = String(block.text).trim();
      }
      if (excerptFromBlocks) {
        break;
      }
    }
  }

  return {
    ...post,
    description:
      post.description ||
      post.excerpt ||
      excerptFromBlocks ||
      post.metaDescription ||
      "",
    featuredImage: post.featuredImage || post.featured_image || null,
    tags,
    views: post.views ?? engagement.views,
    likes: post.likes ?? engagement.likes,
    shares: post.shares ?? engagement.shares,
    isLiked: post.isLiked ?? flags.isLiked,
    isBookmarked: post.isBookmarked ?? flags.isBookmarked,
    isFeatured: post.isFeatured ?? flags.isFeatured,
    allowComments: post.allowComments ?? flags.allowComments,
  };
};

const buildDetailPost = (post = {}) => {
  const normalized = normalizePost(post);
  const rawContent = normalized.content || {};
  const derivedSections =
    rawContent?.blocks && Array.isArray(rawContent.blocks)
      ? buildContentFromBlocks(
          rawContent,
          normalized.description || normalized.metaDescription
        )
      : rawContent?.sections
        ? rawContent
        : buildContentFromBlocks({}, normalized.description);

  const content = {
    ...rawContent,
    ...derivedSections,
  };

  return {
    ...normalized,
    content,
    images: Array.isArray(normalized.images) ? normalized.images : [],
    featuredImage:
      normalized.featuredImage ||
      (normalized.image
        ? { url: normalized.image, alt: normalized.title }
        : null),
  };
};

// Move all components outside BlogPage to prevent re-definition
const HeroSection = React.memo(({ onImageLoad }) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
  });

  const handleImageLoad = useCallback(() => {
    setImageState((prev) => ({ ...prev, loaded: true }));
    onImageLoad?.();
  }, [onImageLoad]);

  const handleImageError = useCallback(() => {
    setImageState((prev) => ({ ...prev, error: true, loaded: true }));
  }, []);

  return (
    <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {!imageState.error ? (
          <div
            className={`absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed transform scale-110 transition-opacity duration-700 ${
              imageState.loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900" />
        )}

        {!imageState.loaded && !imageState.error && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}

        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hero background"
          className="hidden"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl">
          ETrek Nepal
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
          Discover the majestic Himalayas through our adventure stories, expert
          guides, and breathtaking journey chronicles
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full">
            Explore Stories
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full">
            Plan Your Trek
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon className="w-8 h-8 text-white opacity-80" />
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

const CategoryFilter = React.memo(
  ({ categories, selectedCategory, onCategoryChange, disabled, postsCount }) => (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              disabled={disabled}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-full border transition-all duration-300 flex items-center gap-2 font-medium text-sm md:text-base ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105 border-transparent"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border-gray-200 hover:border-orange-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-pressed={selectedCategory === category.id}
            >
              <span className="text-base md:text-lg" aria-hidden="true">
                {category.icon}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {postsCount > 0 && (
          <div className="text-center text-sm text-gray-600 mt-2">
            {postsCount} {postsCount === 1 ? "story" : "stories"} found
          </div>
        )}
      </div>
    </div>
  )
);

CategoryFilter.displayName = "CategoryFilter";

// Utility components
const ErrorMessage = React.memo(({ error, onRetry }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  </div>
));

ErrorMessage.displayName = "ErrorMessage";

const LoadingSpinner = React.memo(({ message = "Loading..." }) => (
  <div className="text-center py-16">
    <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const EmptyState = React.memo(() => (
  <div className="text-center py-16 px-4">
    <div className="text-gray-400 text-6xl mb-4">📝</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      No stories available
    </h3>
    <p className="text-gray-600">
      Check back soon for exciting new adventure stories!
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

const NoResultsState = React.memo(({ category, onReset }) => (
  <div className="text-center py-16 px-4">
    <div className="text-gray-400 text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      No stories found in "{category}"
    </h3>
    <p className="text-gray-600 mb-6">
      Try selecting a different category or view all stories.
    </p>
    <button
      onClick={onReset}
      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
    >
      View All Stories
    </button>
  </div>
));

NoResultsState.displayName = "NoResultsState";

// FIXED: Main BlogPage component
const BlogPage = ({ currentUser }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [state, setState] = useState({
    posts: [],
    categories: DEFAULT_CATEGORIES,
    selectedCategory: "all",
    searchQuery: "",
    selectedPost: null,
    showDetail: false,
    loading: true,
    error: null,
    nextPageUrl: null,
    heroImageLoaded: false,
    contentLoading: false,
  });

  const isMountedRef = useRef(true);
  const loadingRef = useRef(false);

  const safeSetState = useCallback((updater) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  const loadBlogList = useCallback(
    async (category) => {
      safeSetState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const data = await fetchBlogPosts({ category });
        const items = Array.isArray(data?.results) ? data.results : data;
        const posts = Array.isArray(items)
          ? items.map((post) => normalizePost(post))
          : [];

        safeSetState((prev) => ({
          ...prev,
          posts,
          nextPageUrl: data?.next || null,
          loading: false,
        }));
      } catch (error) {
        safeSetState((prev) => ({
          ...prev,
          error: error?.detail || "Failed to load blog posts",
          loading: false,
        }));
      }
    },
    [safeSetState]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchBlogCategories();
        const items = Array.isArray(data?.results) ? data.results : data;
        const mapped = Array.isArray(items)
          ? items.map((category) => ({
              id: category.slug || slugify(category.name),
              name: category.name,
              icon: getCategoryIcon(category.name),
            }))
          : [];

        safeSetState((prev) => ({
          ...prev,
          categories: [DEFAULT_CATEGORIES[0], ...mapped],
        }));
      } catch (error) {
        safeSetState((prev) => ({
          ...prev,
          categories: DEFAULT_CATEGORIES,
        }));
      }
    };

    loadCategories();
  }, [safeSetState]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    if (search) {
      safeSetState((prev) => ({
        ...prev,
        searchQuery: search,
      }));
    }
  }, [searchParams, safeSetState]);

  useEffect(() => {
    if (!slug) {
      safeSetState((prev) => ({
        ...prev,
        selectedPost: null,
        showDetail: false,
        contentLoading: false,
      }));
      loadBlogList(state.selectedCategory);
    }
  }, [slug, loadBlogList, safeSetState, state.selectedCategory]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const fetchDetail = async () => {
      safeSetState((prev) => ({
        ...prev,
        contentLoading: true,
        error: null,
      }));

      try {
        const data = await fetchBlogPostBySlug(slug);
        const enrichedBlog = buildDetailPost(data);

        safeSetState((prev) => ({
          ...prev,
          selectedPost: enrichedBlog,
          showDetail: true,
          contentLoading: false,
        }));
      } catch (error) {
        safeSetState((prev) => ({
          ...prev,
          error: error?.detail || "Blog post not found",
          contentLoading: false,
        }));
        navigate("/blog", { replace: true });
      }
    };

    fetchDetail();
  }, [slug, navigate, safeSetState]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(state.posts) || !state.posts.length) return [];
    let scoped = state.posts;

    if (state.selectedCategory !== "all") {
      scoped = scoped.filter(
        (post) =>
          post?.categorySlug === state.selectedCategory ||
          post?.category === state.selectedCategory
      );
    }

    const query = state.searchQuery.trim().toLowerCase();
    if (!query) return scoped;

    return scoped.filter((post) => {
      const haystack = [
        post.title,
        post.subtitle,
        post.metaTitle,
        post.metaDescription,
        post.description,
        post.category,
        post.region,
        ...(post.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [state.posts, state.selectedCategory, state.searchQuery]);

  // Enhanced load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingRef.current || state.loading || !state.nextPageUrl) {
      return;
    }

    loadingRef.current = true;
    safeSetState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await fetchBlogPosts({ pageUrl: state.nextPageUrl });
      const items = Array.isArray(data?.results) ? data.results : data;
      const newPosts = Array.isArray(items)
        ? items.map((post) => normalizePost(post))
        : [];

      safeSetState((prev) => ({
        ...prev,
        posts: [...prev.posts, ...newPosts],
        nextPageUrl: data?.next || null,
        loading: false,
      }));
    } catch (error) {
      safeSetState((prev) => ({
        ...prev,
        error: error?.detail || "Failed to load more posts",
        loading: false,
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [state.loading, state.nextPageUrl, safeSetState]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (categoryId) => {
      if (typeof categoryId !== "string" || state.loading) return;

      safeSetState((prev) => ({
        ...prev,
        selectedCategory: categoryId,
        error: null,
      }));
    },
    [state.loading, safeSetState]
  );

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    safeSetState((prev) => ({
      ...prev,
      searchQuery: value,
    }));
  }, [safeSetState]);


  // Handle post click with URL navigation
  const handlePostClick = useCallback(
    (post) => {
      if (!post || !post.id || !post.slug) {
        console.error("Invalid post data:", post);
        return;
      }

      console.log("🔗 Navigating to post:", post.slug);
      navigate(`/blog/${post.slug}`);
    },
    [navigate]
  );

  // Handle back to blog
  // const handleBackToBlog = useCallback(() => {
  //   console.log("⬅️ Going back to blog list");
  //   navigate("/blog");
  // }, [navigate]);

  // Handle like and bookmark functions
  const handleLike = useCallback(
    async (postId, isLiked) => {
      if (!postId) {
        throw new Error("Post ID is required");
      }

      safeSetState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked,
                likes: isLiked
                  ? (post.likes || 0) + 1
                  : Math.max((post.likes || 0) - 1, 0),
              }
            : post
        ),
      }));
    },
    [safeSetState]
  );

  const handleBookmark = useCallback(
    async (postId, isBookmarked) => {
      if (!postId) {
        throw new Error("Post ID is required");
      }

      safeSetState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId ? { ...post, isBookmarked } : post
        ),
      }));
    },
    [safeSetState]
  );

  const handleRetry = useCallback(() => {
    safeSetState((prev) => ({
      ...prev,
      error: null,
      selectedPost: null,
      showDetail: false,
    }));
    loadBlogList(state.selectedCategory);
  }, [safeSetState, loadBlogList, state.selectedCategory]);

  // Loading state for content
  if (state.contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog content...</p>
        </div>
      </div>
    );
  }

  // FIXED: Show blog detail with proper validation
  if (state.showDetail && state.selectedPost) {
    return (
      <div>
        {/* React 19 Native Metadata - No more Helmet needed */}
        <title>{state.selectedPost.title} - ETrek Nepal</title>
        <meta
          name="description"
          content={
            state.selectedPost.metaDescription || state.selectedPost.description
          }
        />

        <BlogDetail
          blog={state.selectedPost}
          relatedBlogs={state.posts
            .filter((p) => p.id !== state.selectedPost.id)
            .slice(0, 3)}
        />
      </div>
    );
  }

  // Show loading if we have a slug but no selected post yet
  if (slug && !state.showDetail && !state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Render main content
  const renderMainContent = () => {
    if (state.error && !state.posts.length) {
      return <ErrorMessage error={state.error} onRetry={handleRetry} />;
    }

    if (!state.posts.length && state.loading && !state.error) {
      return <LoadingSpinner message="Loading amazing adventures..." />;
    }

    if (!state.posts.length && !state.loading && !state.error) {
      return <EmptyState />;
    }

    if (!filteredPosts.length && state.posts.length > 0) {
      return (
        <NoResultsState
          category={state.selectedCategory}
          onReset={() => handleCategoryChange("all")}
        />
      );
    }

    return (
      <BlogGrid
        posts={filteredPosts}
        loading={state.loading}
        loadMore={loadMorePosts}
        hasMore={Boolean(state.nextPageUrl)}
        onPostClick={handlePostClick}
        onLike={handleLike}
        onBookmark={handleBookmark}
        currentUser={currentUser}
        error={state.error}
        onRetry={handleRetry}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* React 19 Native Metadata */}
      <title>Blog - ETrek Nepal</title>
      <meta
        name="description"
        content="Discover amazing trekking stories and adventures in Nepal"
      />

      <HeroSection
        onImageLoad={() =>
          safeSetState((prev) => ({ ...prev, heroImageLoaded: true }))
        }
      />

      <section className="relative z-20 -mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-10 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">
                  Explore the Himalayas
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-3">
                  Stories, routes, costs, and insider trekking tips
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">
                  Search by destination, tag, or keyword to find the exact trek guidance you need.
                </p>
              </div>
              <div className="w-full lg:max-w-sm">
                <div className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-3 shadow-sm bg-gray-50">
                  <span className="text-gray-400">🔍</span>
                  <input
                    type="text"
                    value={state.searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search treks, permits, seasons..."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {state.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    state.selectedCategory === category.id
                      ? "bg-orange-500 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoryFilter
        categories={state.categories}
        selectedCategory={state.selectedCategory}
        onCategoryChange={handleCategoryChange}
        disabled={state.loading}
        postsCount={filteredPosts.length}
      />

      {renderMainContent()}
    </div>
  );
};

export default BlogPage;
