// import React, { useState, useEffect } from "react";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import BlogGrid from "./BlogGrid";
// import BlogCard from "./BlogCard";

// const BlogPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [visiblePosts, setVisiblePosts] = useState(6);
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: "ease-in-out",
//       once: true,
//       offset: 100,
//     });

//     // Simulate loading blog posts
//     setPosts(mockBlogPosts);
//   }, []);

//   const loadMorePosts = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setVisiblePosts((prev) => prev + 6);
//       setLoading(false);
//     }, 1000);
//   };

//   const filteredPosts =
//     selectedCategory === "all"
//       ? posts
//       : posts.filter((post) => post.category === selectedCategory);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Hero Section with Parallax */}
//       <HeroSection />

//       {/* Navigation Filters */}
//       <CategoryFilter
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//       />

//       {/* Blog Grid */}
//       <BlogGrid
//         posts={filteredPosts.slice(0, visiblePosts)}
//         loading={loading}
//         loadMore={loadMorePosts}
//         hasMore={visiblePosts < filteredPosts.length}
//       />
//     </div>
//   );
// };

// // Hero Section Component (unchanged)
// const HeroSection = () => {
//   return (
//     <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
//       {/* Parallax Background */}
//       <div className="absolute inset-0 z-0">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed transform scale-110"
//           style={{
//             backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
//           }}
//         />

//         {/* Floating Elements */}
//         <div className="absolute top-20 left-10 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-float" />
//         <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-float-delayed" />
//         <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-float-slow" />
//       </div>

//       {/* Hero Content */}
//       <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
//         <h1
//           className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 neon-text"
//           data-aos="fade-up"
//           data-aos-delay="200"
//         >
//           EverTrek Nepal
//         </h1>
//         <p
//           className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed"
//           data-aos="fade-up"
//           data-aos-delay="400"
//         >
//           Discover the majestic Himalayas through our adventure stories, expert
//           guides, and breathtaking journey chronicles
//         </p>
//         <div
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//           data-aos="fade-up"
//           data-aos-delay="600"
//         >
//           <button className="glass-button px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
//             Explore Stories
//           </button>
//           <button className="outline-button px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
//             Plan Your Trek
//           </button>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <ChevronDownIcon className="w-8 h-8 text-white" />
//       </div>
//     </section>
//   );
// };

// // Category Filter Component (unchanged)
// const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
//   const categories = [
//     { id: "all", name: "All Stories", icon: "" },
//     { id: "trekking", name: "Trekking", icon: "" },
//     { id: "culture", name: "Culture", icon: "" },
//     { id: "wildlife", name: "Wildlife", icon: "" },
//     { id: "gear", name: "Gear Guide", icon: "" },
//     { id: "tips", name: "Travel Tips", icon: "" },
//   ];

//   return (
//     <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-wrap justify-center gap-2 md:gap-4">
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setSelectedCategory(category.id)}
//               className={`category-filter-btn ${
//                 selectedCategory === category.id
//                   ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//               data-aos="fade-down"
//               data-aos-delay={categories.indexOf(category) * 100}
//             >
//               <span className="text-base md:text-lg mr-2">{category.icon}</span>
//               <span className="text-sm md:text-base">{category.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Mock Data (unchanged)
// const mockBlogPosts = [
//   {
//     id: 1,
//     title: "Conquering Everest Base Camp: A Journey of a Lifetime",
//     excerpt:
//       "Experience the ultimate adventure as we trek through the heart of the Himalayas, sharing stories of triumph, challenge, and breathtaking beauty along the way to the world's most famous base camp.",
//     image:
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     category: "trekking",
//     date: "March 15, 2025",
//     location: "Everest Region",
//     readTime: 8,
//     views: "2.3k",
//     author: {
//       name: "Pemba Sherpa",
//       role: "Mountain Guide",
//       avatar:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
//     },
//   },
//   {
//     id: 2,
//     title: "Hidden Gems of Annapurna Circuit",
//     excerpt:
//       "Discover secret viewpoints and untouched villages along the classic Annapurna Circuit trek.",
//     image:
//       "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     category: "trekking",
//     date: "March 12, 2025",
//     location: "Annapurna Region",
//     readTime: 6,
//     views: "1.8k",
//     author: {
//       name: "Sarah Johnson",
//       role: "Travel Writer",
//       avatar:
//         "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
//     },
//   },
//   {
//     id: 3,
//     title: "Cultural Immersion in Kathmandu Valley",
//     excerpt:
//       "Explore ancient temples, vibrant markets, and living traditions in Nepal's cultural heart.",
//     image:
//       "https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     category: "culture",
//     date: "March 10, 2025",
//     location: "Kathmandu",
//     readTime: 5,
//     views: "1.2k",
//     author: {
//       name: "Raj Tamang",
//       role: "Cultural Guide",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
//     },
//   },
// ];

// // Custom CSS Styles (unchanged - keep all your existing styles)
// const customStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

//   * {
//     font-family: 'Inter', sans-serif;
//   }

//   .neon-text {
//     text-shadow:
//       0 0 5px rgba(255, 107, 107, 0.5),
//       0 0 10px rgba(255, 107, 107, 0.5),
//       0 0 15px rgba(255, 107, 107, 0.5),
//       0 0 20px rgba(255, 107, 107, 0.5);
//   }

//   .glass-button {
//     background: rgba(255, 255, 255, 0.1);
//     backdrop-filter: blur(10px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     border-radius: 50px;
//     color: white;
//     transition: all 0.3s ease;
//   }

//   .glass-button:hover {
//     background: rgba(255, 255, 255, 0.2);
//     transform: translateY(-2px);
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
//   }

//   .outline-button {
//     border: 2px solid white;
//     border-radius: 50px;
//     color: white;
//     background: transparent;
//     transition: all 0.3s ease;
//   }

//   .outline-button:hover {
//     background: white;
//     color: #f97316;
//     transform: translateY(-2px);
//   }

//   .category-filter-btn {
//     padding: 8px 16px;
//     border-radius: 50px;
//     border: 1px solid #e5e7eb;
//     transition: all 0.3s ease;
//     font-weight: 500;
//     display: flex;
//     align-items: center;
//     white-space: nowrap;
//   }

//   @media (min-width: 768px) {
//     .category-filter-btn {
//       padding: 12px 24px;
//     }
//   }

//   .category-filter-btn:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }

//   .featured-post-card {
//     background: white;
//     border-radius: 24px;
//     padding: 20px;
//     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//     transition: all 0.3s ease;
//   }

//   @media (min-width: 768px) {
//     .featured-post-card {
//       padding: 32px;
//     }
//   }

//   .featured-post-card:hover {
//     transform: translateY(-8px);
//     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//   }

//   .blog-card {
//     background: white;
//     border-radius: 16px;
//     padding: 20px;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//     transition: all 0.3s ease;
//     border: 1px solid #f3f4f6;
//   }

//   .blog-card:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
//     border-color: #e5e7eb;
//   }

//   .category-badge {
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     color: white;
//     padding: 4px 12px;
//     border-radius: 20px;
//     font-size: 12px;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//   }

//   .category-badge.featured {
//     background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//   }

//   .read-more-btn {
//     color: #f97316;
//     font-weight: 600;
//     transition: all 0.3s ease;
//   }

//   .read-more-btn:hover {
//     color: #ea580c;
//     transform: translateX(4px);
//   }

//   .load-more-btn {
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     color: white;
//     padding: 16px 32px;
//     border-radius: 50px;
//     font-weight: 600;
//     transition: all 0.3s ease;
//     border: none;
//     cursor: pointer;
//   }

//   .load-more-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
//   }

//   .load-more-btn:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }

//   .loading-spinner {
//     width: 16px;
//     height: 16px;
//     border: 2px solid transparent;
//     border-top: 2px solid currentColor;
//     border-radius: 50%;
//     animation: spin 1s linear infinite;
//   }

//   .line-clamp-2 {
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }

//   .line-clamp-3 {
//     display: -webkit-box;
//     -webkit-line-clamp: 3;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }

//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }

//   @keyframes float {
//     0%, 100% { transform: translateY(0px); }
//     50% { transform: translateY(-20px); }
//   }

//   @keyframes float-delayed {
//     0%, 100% { transform: translateY(0px); }
//     50% { transform: translateY(-15px); }
//   }

//   @keyframes float-slow {
//     0%, 100% { transform: translateY(0px); }
//     50% { transform: translateY(-10px); }
//   }

//   .animate-float {
//     animation: float 6s ease-in-out infinite;
//   }

//   .animate-float-delayed {
//     animation: float-delayed 8s ease-in-out infinite;
//   }

//   .animate-float-slow {
//     animation: float-slow 10s ease-in-out infinite;
//   }

//   /* Mobile optimizations */
//   @media (max-width: 768px) {
//     .bg-fixed {
//       background-attachment: scroll !important;
//     }
//   }
// `;

// // Add custom styles to document
// const styleSheet = document.createElement("style");
// styleSheet.innerText = customStyles;
// document.head.appendChild(styleSheet);

// export default BlogPage;

import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import AOS from "aos";
import "aos/dist/aos.css";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });

    // Simulate loading blog posts
    setPosts(mockBlogPosts);
  }, []);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePosts((prev) => prev + 6);
      setLoading(false);
    }, 1000);
  };

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Parallax */}
      <HeroSection />

      {/* Navigation Filters */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Blog Grid */}
      <BlogGrid
        posts={filteredPosts.slice(0, visiblePosts)}
        loading={loading}
        loadMore={loadMorePosts}
        hasMore={visiblePosts < filteredPosts.length}
      />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed transform scale-110"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-float-slow" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 neon-text"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          EverTrek Nepal
        </h1>
        <p
          className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Discover the majestic Himalayas through our adventure stories, expert
          guides, and breathtaking journey chronicles
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <button className="glass-button px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
            Explore Stories
          </button>
          <button className="outline-button px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
            Plan Your Trek
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon className="w-8 h-8 text-white" />
      </div>
    </section>
  );
};

// Category Filter Component
const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: "all", name: "All Stories", icon: "" },
    { id: "trekking", name: "Trekking", icon: "" },
    { id: "culture", name: "Culture", icon: "" },
    { id: "wildlife", name: "Wildlife", icon: "" },
    { id: "gear", name: "Gear Guide", icon: "" },
    { id: "tips", name: "Travel Tips", icon: "" },
  ];

  return (
    <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-filter-btn ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              data-aos="fade-down"
              data-aos-delay={categories.indexOf(category) * 100}
            >
              <span className="text-base md:text-lg mr-2">{category.icon}</span>
              <span className="text-sm md:text-base">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
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

            <button className="read-more-btn">Read Full Story </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// Blog Card Component
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

// Mock Data
const mockBlogPosts = [
  {
    id: 1,
    title: "Conquering Everest Base Camp: A Journey of a Lifetime",
    excerpt:
      "Experience the ultimate adventure as we trek through the heart of the Himalayas, sharing stories of triumph, challenge, and breathtaking beauty along the way to the world's most famous base camp.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "trekking",
    date: "March 15, 2025",
    location: "Everest Region",
    readTime: 8,
    views: "2.3k",
    author: {
      name: "Pemba Sherpa",
      role: "Mountain Guide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
  },
  {
    id: 2,
    title: "Hidden Gems of Annapurna Circuit",
    excerpt:
      "Discover secret viewpoints and untouched villages along the classic Annapurna Circuit trek.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "trekking",
    date: "March 12, 2025",
    location: "Annapurna Region",
    readTime: 6,
    views: "1.8k",
    author: {
      name: "Sarah Johnson",
      role: "Travel Writer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
  },
  {
    id: 3,
    title: "Cultural Immersion in Kathmandu Valley",
    excerpt:
      "Explore ancient temples, vibrant markets, and living traditions in Nepal's cultural heart.",
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "culture",
    date: "March 10, 2025",
    location: "Kathmandu",
    readTime: 5,
    views: "1.2k",
    author: {
      name: "Raj Tamang",
      role: "Cultural Guide",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
  },
];

// Custom CSS Styles
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
  }
  
  .neon-text {
    text-shadow: 
      0 0 5px rgba(255, 107, 107, 0.5),
      0 0 10px rgba(255, 107, 107, 0.5),
      0 0 15px rgba(255, 107, 107, 0.5),
      0 0 20px rgba(255, 107, 107, 0.5);
  }
  
  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: white;
    transition: all 0.3s ease;
  }
  
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .outline-button {
    border: 2px solid white;
    border-radius: 50px;
    color: white;
    background: transparent;
    transition: all 0.3s ease;
  }
  
  .outline-button:hover {
    background: white;
    color: #f97316;
    transform: translateY(-2px);
  }
  
  .category-filter-btn {
    padding: 8px 16px;
    border-radius: 50px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    font-weight: 500;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  
  @media (min-width: 768px) {
    .category-filter-btn {
      padding: 12px 24px;
    }
  }
  
  .category-filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .featured-post-card {
    background: white;
    border-radius: 24px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  @media (min-width: 768px) {
    .featured-post-card {
      padding: 32px;
    }
  }
  
  .featured-post-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .blog-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #f3f4f6;
  }
  
  .blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb;
  }
  
  .category-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .category-badge.featured {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  .read-more-btn {
    color: #f97316;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .read-more-btn:hover {
    color: #ea580c;
    transform: translateX(4px);
  }
  
  .load-more-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .load-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .load-more-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
  }
  
  .animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    .bg-fixed {
      background-attachment: scroll !important;
    }
  }
`;

// Add custom styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

export default BlogPage;
