import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from "react";
import {
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  CalendarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import SocialShareSidebar from "./SocialShare";
import OptimizedImage from "./OptimizedImage";
import ImageGallery from "./ImageGallery";
import mockBlogPosts from "./mockPost";
import SEO from "../components/common/SEO";

// Reading Progress Component
const ReadingProgress = React.memo(({ progress }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
      style={{ width: `${Math.min(progress, 100)}%` }}
    />
  </div>
));

ReadingProgress.displayName = "ReadingProgress";

// Enhanced Content Renderer
const ContentRenderer = React.memo(({ content, images = [] }) => {
  const processedSections = useMemo(() => {
    if (!content?.sections || !Array.isArray(content.sections)) {
      console.log("ContentRenderer: No valid sections found", content);
      return [];
    }

    return content.sections.map((section, index) => {
      // Add images strategically throughout the content
      const shouldAddImage = images.length > 0 && (index + 1) % 2 === 0;
      const imageIndex = Math.floor(index / 2) % images.length;

      return {
        ...section,
        embedImage: shouldAddImage ? images[imageIndex] : null,
      };
    });
  }, [content?.sections, images]);

  return (
    <div className="prose prose-lg max-w-none">
      {content?.introduction && (
        <div className="mb-12">
          <p className="text-xl md:text-2xl leading-relaxed font-medium text-gray-700 mb-8">
            {content.introduction}
          </p>
        </div>
      )}

      <div className="space-y-12">
        {processedSections.map((section, index) => (
          <section
            key={section.id || index}
            id={section.id}
            className="scroll-mt-24"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {section.title}
            </h2>

            <div className="space-y-6">
              <div className="text-lg leading-relaxed text-gray-700">
                {section.content &&
                  section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {section.subsections && section.subsections.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 my-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Points:
                  </h3>
                  <ul className="space-y-3">
                    {section.subsections.map((subsection, subIndex) => (
                      <li key={subIndex} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-3"></span>
                        <span className="text-gray-700 leading-relaxed">
                          {subsection}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Embed images strategically */}
              {section.embedImage && (
                <div className="my-10">
                  <OptimizedImage
                    src={section.embedImage.url}
                    alt={section.embedImage.alt || `Image for ${section.title}`}
                    caption={section.embedImage.caption}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Image Gallery Section */}
      {images && images.length > 3 && <ImageGallery images={images.slice(3)} />}
    </div>
  );
});

ContentRenderer.displayName = "ContentRenderer";

// Main BlogDetail Component
const BlogDetail = ({
  blog,
  relatedBlogs = [],
  onBookmarkToggle,
  onShareClick,
  onBack,
}) => {
  // FIXED: Add loading state while blog data is being fetched
  if (blog === undefined || blog === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  const [state, setState] = useState({
    readingProgress: 0,
    shareSidebarOpen: false,
    isBookmarked: false,
  });

  // FIXED: Add contentRef for reading progress
  const contentRef = useRef(null);

  // Enhanced blog data processing
  const enhancedBlog = useMemo(() => {
    console.log("BlogDetail: Received blog data:", blog);

    if (!blog) {
      console.log("BlogDetail: No blog data provided");
      return null;
    }

    const safeBlog = {
      id: blog.id || "unknown",
      title: blog.title || "Untitled Post",
      category: blog.category || "General",
      publishDate: blog.publishDate || blog.date || new Date().toISOString(),
      metaDescription:
        blog.metaDescription || blog.description || "No description available",
      image: blog.image || blog.featuredImage?.url,
      featuredImage: blog.featuredImage || {
        url: blog.image,
        alt: blog.title || "Blog image",
      },
      content: blog.content || {
        introduction:
          blog.metaDescription || blog.description || "Welcome to this story.",
        sections: blog.content?.sections || [
          {
            id: "main-content",
            title: "Story",
            content:
              blog.description || "This is the main content of the story.",
            subsections: [],
          },
        ],
      },
      images: Array.isArray(blog.images) ? blog.images : [],
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      views: blog.views || "1.2k",
      readTime: blog.readTime || 5,
      ...blog,
    };

    // Calculate word count and read time
    const content =
      safeBlog.content?.sections?.map((s) => s.content).join(" ") ||
      safeBlog.metaDescription ||
      "";
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const estimatedReadTime = Math.max(Math.ceil(wordCount / 200), 1);

    return {
      ...safeBlog,
      wordCount,
      estimatedReadTime,
    };
  }, [blog]);

  // FIXED: Add reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = window.pageYOffset;
      const docHeight = element.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);

      setState((prev) => ({
        ...prev,
        readingProgress: Math.min(Math.max(scrollPercentRounded, 0), 100),
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIXED: Add missing handlers
  const handleShareClick = useCallback(() => {
    setState((prev) => ({ ...prev, shareSidebarOpen: true }));
    onShareClick?.();
  }, [onShareClick]);

  const handleBookmarkToggle = useCallback(() => {
    setState((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    onBookmarkToggle?.(enhancedBlog.id, !state.isBookmarked);
  }, [enhancedBlog?.id, state.isBookmarked, onBookmarkToggle]);

  // FIXED: Better error handling
  if (!enhancedBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or failed to load.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Back to Blog
            </button>
          )}
        </div>
      </div>
    );
  }

  const seoSchema = enhancedBlog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": enhancedBlog.title,
    "image": [enhancedBlog.featuredImage?.url || enhancedBlog.image],
    "datePublished": enhancedBlog.publishDate,
    "author": {
      "@type": "Organization",
      "name": "EverTrek Nepal"
    },
    "description": enhancedBlog.metaDescription
  } : null;

  return (
    <div className="min-h-screen bg-white">
      {enhancedBlog && (
        <SEO
          title={enhancedBlog.title}
          description={enhancedBlog.metaDescription || enhancedBlog.description}
          image={enhancedBlog.featuredImage?.url || enhancedBlog.image}
          keywords={`blog, nepal, ${enhancedBlog.category}, ${enhancedBlog.tags?.join(', ')}`}
          type="article"
          schema={seoSchema}
        />
      )}
      <ReadingProgress progress={state.readingProgress} />

      {/* Back Button */}
      {onBack && (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-1 sm:px-2 lg:px-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={<div />}>
        <SocialShareSidebar
          isOpen={state.shareSidebarOpen}
          onClose={() =>
            setState((prev) => ({ ...prev, shareSidebarOpen: false }))
          }
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={enhancedBlog.title}
          description={enhancedBlog.metaDescription}
        />
      </Suspense>

      <main className="relative">
        <div className="max-w-4xl mx-auto px-1 sm:px-2 lg:px-4 py-8">
          <header className="mb-12">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full mb-4">
                {enhancedBlog.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {enhancedBlog.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <time dateTime={enhancedBlog.publishDate}>
                  {new Date(enhancedBlog.publishDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{enhancedBlog.estimatedReadTime} min read</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>{enhancedBlog.views} views</span>
              </div>
              <span>•</span>
              <span>{enhancedBlog.wordCount} words</span>
            </div>

            <OptimizedImage
              src={enhancedBlog.featuredImage?.url || enhancedBlog.image}
              alt={enhancedBlog.featuredImage?.alt || enhancedBlog.title}
              caption={enhancedBlog.featuredImage?.caption}
              priority={true}
              className="w-full mb-8"
            />
          </header>

          <article ref={contentRef}>
            <ContentRenderer
              content={enhancedBlog.content}
              images={enhancedBlog.images || []}
            />

            {enhancedBlog.tags && enhancedBlog.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {enhancedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleShareClick}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <ShareIcon className="w-5 h-5" />
                  Share this story
                </button>

                <button
                  onClick={handleBookmarkToggle}
                  className={`flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border-2 transition-all duration-300 transform hover:-translate-y-1 ${state.isBookmarked
                    ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-orange-300"
                    }`}
                >
                  {state.isBookmarked ? (
                    <BookmarkSolidIcon className="w-5 h-5" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  {state.isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </div>
          </article>

          {relatedBlogs && relatedBlogs.length > 0 && (
            <section className="mt-20 pt-12 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Adventures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                  <article
                    key={relatedBlog.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="relative overflow-hidden">
                      <OptimizedImage
                        src={
                          relatedBlog.featuredImage?.url || relatedBlog.image
                        }
                        alt={
                          relatedBlog.featuredImage?.alt || relatedBlog.title
                        }
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-full">
                          {relatedBlog.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedBlog.metaDescription || relatedBlog.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {relatedBlog.readTime || 5} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          {relatedBlog.views || "1k"} views
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default React.memo(BlogDetail);
