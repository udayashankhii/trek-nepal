// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";

// import { useParams, useNavigate } from "react-router-dom";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
// import BlogGrid from "./BlogGrid";
// import BlogDetail from "./BlogDetails";
// import mockBlogPosts from "./mockPost";

// // Error Boundary Component - FIXED: Complete class definition
// class BlogDetailErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("BlogDetail Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="text-center p-8 max-w-md mx-auto">
//             <div className="text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Something went wrong
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Unable to load the blog content. Please try again.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//             >
//               Reload Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // FIXED: Removed unused imports and components
// const BlogPage = ({ currentUser }) => {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   // Single state object for all stateful data
//   const [state, setState] = useState({
//     posts: [],
//     selectedCategory: "all",
//     selectedPost: null,
//     showDetail: false,
//     loading: false,
//     error: null,
//     visiblePosts: 6,
//     hasMore: false,
//     totalPages: 1,
//     initialized: false,
//     heroImageLoaded: false,
//     contentLoading: false,
//   });
//   useEffect(() => {
//     console.log("🚩 URL slug is:", slug);
//   }, [slug]);

//   // Refs for memory leak prevention
//   const isMountedRef = useRef(true);
//   const abortControllerRef = useRef(null);
//   const loadingRef = useRef(false);

//   // CRITICAL FIX: Define safeSetState function
//   const safeSetState = useCallback((updater) => {
//     if (isMountedRef.current) {
//       setState(updater);
//     }
//   }, []);
//   useEffect(() => {
//     console.log("🚩 URL slug is:", slug);
//   }, [slug]);

//   // Cleanup on unmount - FIXED: Added proper cleanup
//   useEffect(() => {
//     console.log(
//       "Looking for slug…",
//       slug,
//       "among posts:",
//       state.posts.map((p) => p.slug)
//     );
//     if (!state.initialized || !slug || !state.posts.length) return;

//     if (!Array.isArray(mockBlogPosts) || mockBlogPosts.length === 0) {
//       setState((prev) => ({
//         ...prev,
//         error: "No posts available",
//         initialized: true,
//       }));
//       return;
//     }

//     setState((prev) => ({
//       ...prev,
//       posts: mockBlogPosts,
//       hasMore: mockBlogPosts.length > 6,
//       totalPages: Math.ceil(mockBlogPosts.length / 6),
//       initialized: true,
//     }));
//   }, [state.initialized]);

//   // 2) When posts are loaded _and_ there's a slug param, find & show that post
//   // FIXED: Remove navigate from dependencies to prevent infinite re-renders
//   // FIXED - Remove navigate from dependencies
//   // load posts
//   setState((prev) => ({
//     ...prev,
//     posts: mockBlogPosts,
//     hasMore: mockBlogPosts.length > 6,
//     totalPages: Math.ceil(mockBlogPosts.length / 6),
//   }));

//   if (slug) {
//     const match = mockBlogPosts.find((p) => p.slug === slug);
//     if (match) {
//       setState((prev) => ({
//         ...prev,
//         selectedPost: match,
//         showDetail: true,
//       }));
//     } else {
//       navigate("/blog", { replace: true });
//     }
//   }
//   // Memoized filtered posts
//   const filteredPosts = useMemo(() => {
//     if (!Array.isArray(state.posts) || !state.posts.length) return [];
//     return state.selectedCategory === "all"
//       ? state.posts
//       : state.posts.filter((post) => post?.category === state.selectedCategory);
//   }, [state.posts, state.selectedCategory]);

//   // Memoized visible posts
//   const visiblePosts = useMemo(() => {
//     return filteredPosts.slice(0, state.visiblePosts);
//   }, [filteredPosts, state.visiblePosts]);

//   // Enhanced load more posts
//   const loadMorePosts = useCallback(async () => {
//     if (
//       loadingRef.current ||
//       state.loading ||
//       state.visiblePosts >= filteredPosts.length
//     )
//       return;

//     loadingRef.current = true;
//     safeSetState((prev) => ({ ...prev, loading: true }));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       safeSetState((prev) => ({
//         ...prev,
//         visiblePosts: Math.min(prev.visiblePosts + 6, filteredPosts.length),
//         loading: false,
//       }));
//     } catch (error) {
//       console.error("Failed to load more posts:", error);
//       safeSetState((prev) => ({
//         ...prev,
//         error: "Failed to load more posts",
//         loading: false,
//       }));
//     } finally {
//       loadingRef.current = false;
//     }
//   }, [state.loading, state.visiblePosts, filteredPosts.length, safeSetState]);

//   // Handle category change
//   const handleCategoryChange = useCallback(
//     (categoryId) => {
//       if (typeof categoryId !== "string" || state.loading) return;

//       safeSetState((prev) => ({
//         ...prev,
//         selectedCategory: categoryId,
//         visiblePosts: 6,
//         error: null,
//       }));
//     },
//     [state.loading, safeSetState]
//   );

//   // Handle post click with URL navigation
//   const handlePostClick = useCallback(
//     async (post) => {
//       if (!post || !post.id || !post.slug) {
//         console.error("Invalid post data:", post);
//         return;
//       }

//       // Navigate to the blog post URL
//       navigate(`/blog/${post.slug}`);

//       // Ensure proper data structure
//       const enrichedPost = {
//         ...post,
//         content: post.content || {
//           introduction:
//             post.metaDescription ||
//             post.description ||
//             "Welcome to this adventure story.",
//           sections: post.content?.sections || [],
//         },
//         featuredImage: post.featuredImage || {
//           url: post.image,
//           alt: post.title,
//           caption: null,
//         },
//       };

//       safeSetState((prev) => ({
//         ...prev,
//         selectedPost: enrichedPost,
//         showDetail: true,
//         contentLoading: false,
//       }));
//     },
//     [safeSetState, navigate]
//   );

//   // Handle back to blog
//   const handleBackToBlog = useCallback(() => {
//     navigate("/blog");
//     safeSetState((prev) => ({
//       ...prev,
//       selectedPost: null,
//       showDetail: false,
//     }));
//   }, [safeSetState, navigate]);

//   // Handle like with optimistic updates
//   const handleLike = useCallback(
//     async (postId, isLiked) => {
//       if (!postId) {
//         throw new Error("Post ID is required");
//       }

//       safeSetState((prev) => ({
//         ...prev,
//         posts: prev.posts.map((post) =>
//           post.id === postId
//             ? {
//                 ...post,
//                 isLiked,
//                 likes: isLiked
//                   ? (post.likes || 0) + 1
//                   : Math.max((post.likes || 0) - 1, 0),
//               }
//             : post
//         ),
//       }));
//     },
//     [safeSetState]
//   );

//   // Handle bookmark with optimistic updates
//   const handleBookmark = useCallback(
//     async (postId, isBookmarked) => {
//       if (!postId) {
//         throw new Error("Post ID is required");
//       }

//       safeSetState((prev) => ({
//         ...prev,
//         posts: prev.posts.map((post) =>
//           post.id === postId ? { ...post, isBookmarked } : post
//         ),
//       }));
//     },
//     [safeSetState]
//   );

//   // Handle retry
//   const handleRetry = useCallback(() => {
//     safeSetState((prev) => ({ ...prev, error: null, initialized: false }));
//   }, [safeSetState]);

//   // Loading state for content
//   if (state.contentLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading blog content...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show blog detail if a post is selected
//   if (state.showDetail && state.selectedPost) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Helmet>
//           <title>Blog - Trek Nepal</title>
//           <meta
//             name="description"
//             content="Discover amazing trekking stories and guides from Nepal's most experienced guides."
//           />
//         </Helmet>

//         {/* Blog List View */}
//         {!state.showDetail && (
//           <>
//             {/* Your existing header, search, filters, and blog grid */}
//             <BlogHeader />
//             <BlogFilters />
//             <BlogGrid
//               posts={state.filteredPosts}
//               onPostClick={handlePostClick}
//             />
//           </>
//         )}

//         {/* Blog Detail View - FIXED VERSION */}
//         {state.showDetail && state.selectedPost && state.selectedPost.id && (
//           <BlogDetailErrorBoundary>
//             <BlogDetail
//               blog={state.selectedPost}
//               onBack={handleBackToBlog}
//               relatedBlogs={state.posts.filter(
//                 (p) => p.id !== state.selectedPost.id
//               )}
//               onBookmarkToggle={(isBookmarked) => {
//                 handleBookmark(state.selectedPost.id, isBookmarked);
//               }}
//               onShareClick={() => console.log("Share clicked")}
//             />
//           </BlogDetailErrorBoundary>
//         )}
//       </div>
//     );
//   }

//   // Render main content
//   const renderMainContent = () => {
//     if (state.error && !state.posts.length) {
//       return <ErrorMessage error={state.error} onRetry={handleRetry} />;
//     }

//     if (!state.posts.length && state.loading && !state.error) {
//       return <LoadingSpinner message="Loading amazing adventures..." />;
//     }

//     if (!state.posts.length && !state.loading && !state.error) {
//       return <EmptyState />;
//     }

//     if (!filteredPosts.length && state.posts.length > 0) {
//       return (
//         <NoResultsState
//           category={state.selectedCategory}
//           onReset={() => handleCategoryChange("all")}
//         />
//       );
//     }

//     return (
//       <BlogGrid
//         posts={visiblePosts}
//         loading={state.loading}
//         loadMore={loadMorePosts}
//         hasMore={state.visiblePosts < filteredPosts.length}
//         onPostClick={handlePostClick}
//         onLike={handleLike}
//         onBookmark={handleBookmark}
//         currentUser={currentUser}
//         error={state.error}
//         onRetry={handleRetry}
//       />
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <HeroSection
//         onImageLoad={() =>
//           safeSetState((prev) => ({ ...prev, heroImageLoaded: true }))
//         }
//       />

//       <CategoryFilter
//         selectedCategory={state.selectedCategory}
//         onCategoryChange={handleCategoryChange}
//         disabled={state.loading}
//         postsCount={filteredPosts.length}
//       />

//       {renderMainContent()}
//     </div>
//   );
// };

// // Hero Section Component - FIXED: Added display name
// const HeroSection = React.memo(({ onImageLoad }) => {
//   const [imageState, setImageState] = useState({
//     loaded: false,
//     error: false,
//   });

//   const handleImageLoad = useCallback(() => {
//     setImageState((prev) => ({ ...prev, loaded: true }));
//     onImageLoad?.();
//   }, [onImageLoad]);

//   const handleImageError = useCallback(() => {
//     setImageState((prev) => ({ ...prev, error: true, loaded: true }));
//   }, []);

//   return (
//     <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 z-0">
//         {!imageState.error ? (
//           <div
//             className={`absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed transform scale-110 transition-opacity duration-700 ${
//               imageState.loaded ? "opacity-100" : "opacity-0"
//             }`}
//             style={{
//               backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
//             }}
//           />
//         ) : (
//           <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900" />
//         )}

//         {!imageState.loaded && !imageState.error && (
//           <div className="absolute inset-0 bg-gray-800 animate-pulse" />
//         )}

//         <img
//           src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
//           alt="Hero background"
//           className="hidden"
//           onLoad={handleImageLoad}
//           onError={handleImageError}
//         />
//       </div>

//       <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
//         <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl">
//           ETrek Nepal
//         </h1>
//         <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
//           Discover the majestic Himalayas through our adventure stories, expert
//           guides, and breathtaking journey chronicles
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full">
//             Explore Stories
//           </button>
//           <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full">
//             Plan Your Trek
//           </button>
//         </div>
//       </div>

//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <ChevronDownIcon className="w-8 h-8 text-white opacity-80" />
//       </div>
//     </section>
//   );
// });

// HeroSection.displayName = "HeroSection";

// // Category Filter Component - FIXED: Added display name
// const CategoryFilter = React.memo(
//   ({ selectedCategory, onCategoryChange, disabled, postsCount }) => {
//     const categories = useMemo(
//       () => [
//         { id: "all", name: "All Stories", icon: "📚" },
//         { id: "Trekking", name: "Trekking", icon: "🏔️" },
//         { id: "Culture", name: "Culture", icon: "🏛️" },
//         { id: "Wildlife", name: "Wildlife", icon: "🦌" },
//         { id: "Gear", name: "Gear Guide", icon: "🎒" },
//         { id: "Tips", name: "Travel Tips", icon: "💡" },
//       ],
//       []
//     );

//     return (
//       <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-2">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => onCategoryChange(category.id)}
//                 disabled={disabled}
//                 className={`px-3 py-2 md:px-6 md:py-3 rounded-full border transition-all duration-300 flex items-center gap-2 font-medium text-sm md:text-base ${
//                   selectedCategory === category.id
//                     ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105 border-transparent"
//                     : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border-gray-200 hover:border-orange-300"
//                 } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//                 aria-pressed={selectedCategory === category.id}
//               >
//                 <span className="text-base md:text-lg" aria-hidden="true">
//                   {category.icon}
//                 </span>
//                 <span>{category.name}</span>
//               </button>
//             ))}
//           </div>

//           {postsCount > 0 && (
//             <div className="text-center text-sm text-gray-600 mt-2">
//               {postsCount} {postsCount === 1 ? "story" : "stories"} found
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// CategoryFilter.displayName = "CategoryFilter";

// // Error and Loading Components - FIXED: Added display names
// const ErrorMessage = React.memo(({ error, onRetry }) => {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="max-w-md mx-auto">
//         <div className="text-red-500 text-6xl mb-4">⚠️</div>
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">
//           Oops! Something went wrong
//         </h3>
//         <p className="text-gray-600 mb-6">{error}</p>
//         <button
//           onClick={onRetry}
//           className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );
// });

// ErrorMessage.displayName = "ErrorMessage";

// const LoadingSpinner = React.memo(({ message = "Loading..." }) => {
//   return (
//     <div className="text-center py-16">
//       <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//       <p className="text-gray-600">{message}</p>
//     </div>
//   );
// });

// LoadingSpinner.displayName = "LoadingSpinner";

// const EmptyState = React.memo(() => {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="text-gray-400 text-6xl mb-4">📝</div>
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">
//         No stories available
//       </h3>
//       <p className="text-gray-600">
//         Check back soon for exciting new adventure stories!
//       </p>
//     </div>
//   );
// });

// EmptyState.displayName = "EmptyState";

// const NoResultsState = React.memo(({ category, onReset }) => {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="text-gray-400 text-6xl mb-4">🔍</div>
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">
//         No stories found in "{category}"
//       </h3>
//       <p className="text-gray-600 mb-6">
//         Try selecting a different category or view all stories.
//       </p>
//       <button
//         onClick={onReset}
//         className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
//       >
//         View All Stories
//       </button>
//     </div>
//   );
// });

// NoResultsState.displayName = "NoResultsState";

// export default BlogPage;
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BlogGrid from "./BlogGrid";
import BlogDetail from "./BlogDetails";
import mockBlogPosts from "./mockPost";

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
  ({ selectedCategory, onCategoryChange, disabled, postsCount }) => {
    const categories = useMemo(
      () => [
        { id: "all", name: "All Stories", icon: "📚" },
        { id: "Trekking", name: "Trekking", icon: "🏔️" },
        { id: "Culture", name: "Culture", icon: "🏛️" },
        { id: "Wildlife", name: "Wildlife", icon: "🦌" },
        { id: "Gear", name: "Gear Guide", icon: "🎒" },
        { id: "Tips", name: "Travel Tips", icon: "💡" },
      ],
      []
    );

    return (
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
    );
  }
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

  const [state, setState] = useState({
    posts: mockBlogPosts, // FIXED: Initialize directly with mockBlogPosts
    selectedCategory: "all",
    selectedPost: null,
    showDetail: false,
    loading: false,
    error: null,
    visiblePosts: 6,
    hasMore: mockBlogPosts.length > 6,
    totalPages: Math.ceil(mockBlogPosts.length / 6),
    initialized: true, // FIXED: Set to true since we have posts
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

  // FIXED: Handle slug changes with direct mockBlogPosts lookup
  useEffect(() => {
    console.log("🚩 URL slug changed:", slug);

    if (!slug) {
      console.log("📋 No slug, showing blog list");
      safeSetState((prev) => ({
        ...prev,
        selectedPost: null,
        showDetail: false,
      }));
      return;
    }

    console.log("🔍 Looking for post with slug:", slug);
    console.log(
      "📚 Available posts:",
      mockBlogPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
      }))
    );

    // FIXED: Always search in mockBlogPosts directly
    const match = mockBlogPosts.find((p) => p.slug === slug);

    if (match) {
      console.log("✅ Found matching post:", match.title);

      // Create enriched blog data for BlogDetail
      const enrichedBlog = {
        ...match,
        // Ensure proper content structure
        content: match.content || {
          introduction:
            match.metaDescription ||
            match.description ||
            "Welcome to this adventure story.",
          sections: match.content?.sections || [
            {
              id: "main-content",
              title: "Story",
              content:
                match.description || "This is the main content of the story.",
              subsections: [],
            },
          ],
        },
        // Ensure proper featured image structure
        featuredImage: match.featuredImage || {
          url: match.image,
          alt: match.title,
          caption: null,
        },
        // Add any missing fields
        author: match.author || "ETrek Nepal Team",
        publishedAt:
          match.publishedAt || match.date || new Date().toISOString(),
        readTime: match.readTime || "5 min read",
        tags: match.tags || [],
        likes: match.likes || 0,
        isLiked: match.isLiked || false,
        isBookmarked: match.isBookmarked || false,
      };

      console.log("📝 Enriched blog data:", enrichedBlog);

      safeSetState((prev) => ({
        ...prev,
        selectedPost: enrichedBlog,
        showDetail: true,
      }));
    } else {
      console.log("❌ No matching post found, redirecting to blog list");
      navigate("/blog", { replace: true });
    }
  }, [slug, navigate, safeSetState]); // FIXED: Removed state.posts dependency

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(state.posts) || !state.posts.length) return [];
    return state.selectedCategory === "all"
      ? state.posts
      : state.posts.filter((post) => post?.category === state.selectedCategory);
  }, [state.posts, state.selectedCategory]);

  // Memoized visible posts
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, state.visiblePosts);
  }, [filteredPosts, state.visiblePosts]);

  // Enhanced load more posts
  const loadMorePosts = useCallback(async () => {
    if (
      loadingRef.current ||
      state.loading ||
      state.visiblePosts >= filteredPosts.length
    )
      return;

    loadingRef.current = true;
    safeSetState((prev) => ({ ...prev, loading: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      safeSetState((prev) => ({
        ...prev,
        visiblePosts: Math.min(prev.visiblePosts + 6, filteredPosts.length),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to load more posts:", error);
      safeSetState((prev) => ({
        ...prev,
        error: "Failed to load more posts",
        loading: false,
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [state.loading, state.visiblePosts, filteredPosts.length, safeSetState]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (categoryId) => {
      if (typeof categoryId !== "string" || state.loading) return;

      safeSetState((prev) => ({
        ...prev,
        selectedCategory: categoryId,
        visiblePosts: 6,
        error: null,
      }));
    },
    [state.loading, safeSetState]
  );

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
  }, [safeSetState]);

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
    console.log("🎯 Rendering BlogDetail with:", {
      id: state.selectedPost.id,
      title: state.selectedPost.title,
      slug: state.selectedPost.slug,
    });

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
          relatedBlogs={mockBlogPosts
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
        posts={visiblePosts}
        loading={state.loading}
        loadMore={loadMorePosts}
        hasMore={state.visiblePosts < filteredPosts.length}
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

      <CategoryFilter
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
