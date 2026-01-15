import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Filter,
  Search,
  Heart,
  Map,
  Calendar,
  Users,
  X,
  ChevronDown,
  Zap,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTours } from "../api/tourService.js";
import TourCardEnhanced from "../components/TourCard-Enhanced.jsx";

/**
 * Enhanced Tour Index Page
 * - Advanced filtering system
 * - Better search with autocomplete
 * - Improved sort options
 * - Modern hero section
 * - Responsive grid layout
 * - Performance optimized
 */
function TourIndexPage() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  
  // Advanced Filter State
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [durationFilter, setDurationFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Categories with better organization
  const categories = [
    { 
      id: "all", 
      name: "All Tours",
      icon: "🌍",
      description: "Discover all tours"
    },
    { 
      id: "day", 
      name: "Day Tours",
      icon: "☀️",
      description: "Perfect for short getaways"
    },
    { 
      id: "hiking", 
      name: "Hiking & Trekking",
      icon: "⛰️",
      description: "Adventure on foot"
    },
    { 
      id: "cultural", 
      name: "Cultural Tours",
      icon: "🏛️",
      description: "Immerse in local culture"
    },
    { 
      id: "adventure", 
      name: "Adventure Sports",
      icon: "🎿",
      description: "Adrenaline-pumping activities"
    },
    {
      id: "wellness",
      name: "Wellness & Yoga",
      icon: "🧘",
      description: "Relaxation and rejuvenation"
    },
  ];

  // Duration options with range
  const durationOptions = [
    { id: "1-3", label: "1-3 Days", minDays: 1, maxDays: 3 },
    { id: "4-7", label: "4-7 Days", minDays: 4, maxDays: 7 },
    { id: "8-14", label: "8-14 Days", minDays: 8, maxDays: 14 },
    { id: "15+", label: "15+ Days", minDays: 15, maxDays: 999 },
  ];

  // Sort options
  const sortOptions = [
    { value: "recommended", label: "Recommended For You", icon: "⭐" },
    { value: "price-low", label: "Price: Low to High", icon: "💰" },
    { value: "price-high", label: "Price: High to Low", icon: "💎" },
    { value: "duration-short", label: "Duration: Shortest", icon: "⏱️" },
    { value: "duration-long", label: "Duration: Longest", icon: "📅" },
    { value: "rating", label: "Rating: Highest", icon: "⭐" },
    { value: "newest", label: "Newly Added", icon: "🆕" },
  ];

  // Load tours
  useEffect(() => {
    let isMounted = true;
    const loadTours = async () => {
      setLoading(true);
      try {
        const data = await fetchTours();
        if (!isMounted) return;
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error("Failed to load tours:", error);
      }
      setLoading(false);
    };
    loadTours();
    return () => {
      isMounted = false;
    };
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }
    
    const suggestions = tours
      .filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map(tour => ({
        label: tour.title,
        location: tour.location,
        slug: tour.slug,
      }));
    
    setSearchSuggestions(suggestions);
  }, [searchTerm, tours]);

  // Advanced filtering logic
  useEffect(() => {
    let result = tours;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (activeFilter !== "all") {
      result = result.filter((tour) => tour.categories?.includes(activeFilter));
    }

    // Price range filter
    result = result.filter((tour) => {
      const tourPrice = Number(tour.price ?? 0);
      return tourPrice >= priceRange[0] && tourPrice <= priceRange[1];
    });

    // Duration filter
    if (durationFilter.length > 0) {
      result = result.filter((tour) => {
        // Parse duration string (e.g., "5 Days", "2-3 Days")
        const durationStr = String(tour.duration || "");
        const dayMatch = durationStr.match(/(\d+)/);
        const days = dayMatch ? parseInt(dayMatch[1]) : 0;
        
        return durationFilter.some(filter => {
          const option = durationOptions.find(o => o.id === filter);
          return option && days >= option.minDays && days <= option.maxDays;
        });
      });
    }

    // Rating filter
    if (ratingFilter > 0) {
      result = result.filter((tour) => {
        const rating = Number(tour.rating ?? 0);
        return rating >= ratingFilter;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "duration-short":
        result.sort((a, b) => {
          const aDays = parseInt(String(a.duration || "0"));
          const bDays = parseInt(String(b.duration || "0"));
          return aDays - bDays;
        });
        break;
      case "duration-long":
        result.sort((a, b) => {
          const aDays = parseInt(String(a.duration || "0"));
          const bDays = parseInt(String(b.duration || "0"));
          return bDays - aDays;
        });
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        result.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        // Recommended: combination of rating and reviews
        result.sort((a, b) => {
          const scoreA = (Number(a.rating ?? 0) * 0.7) + (Number(a.reviews ?? 0) * 0.3);
          const scoreB = (Number(b.rating ?? 0) * 0.7) + (Number(b.reviews ?? 0) * 0.3);
          return scoreB - scoreA;
        });
    }

    setFilteredTours(result);
  }, [searchTerm, activeFilter, tours, priceRange, durationFilter, ratingFilter, sortBy]);

  // Handlers
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setPriceRange([0, 1000]);
    setDurationFilter([]);
    setRatingFilter(0);
    setSortBy("recommended");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (activeFilter !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (durationFilter.length > 0) count++;
    if (ratingFilter > 0) count++;
    return count;
  }, [searchTerm, activeFilter, priceRange, durationFilter, ratingFilter]);

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%22100%22%20height=%22100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3ClinearGradient%20id=%22grid%22%20x1=%220%25%22%20y1=%220%25%22%20x2=%22100%25%22%20y2=%22100%25%22%3E%3Cstop%20offset=%220%25%22%20stop-color=%22rgba(255,255,255,0.03)%22/%3E%3Cstop%20offset=%22100%25%22%20stop-color=%22rgba(255,255,255,0)%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%22100%22%20height=%22100%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-20" />
          <img
            src="/moutainimage.avif"
            alt="Nepal Mountains"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-emerald-900/60 to-slate-900/80" />
          
          {/* Animated Gradient Blobs */}
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 max-w-3xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-200 backdrop-blur-sm border border-white/20">
              <Zap size={14} />
              <span>Curated Travel Experiences</span>
            </div>
            
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                Adventure in Nepal
              </span>
            </h1>
            
            <p className="text-lg text-emerald-100 leading-relaxed">
              From misty mountain treks to vibrant cultural immersions, explore Nepal's most
              captivating destinations. Handpicked experiences designed for every traveler.
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative max-w-2xl"
          >
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4">
                <Search size={20} className="text-slate-400" />
              </div>

              <input
                type="text"
                placeholder="Search tours by name, location, or style..."
                className="w-full rounded-2xl bg-white/95 py-4 pl-12 pr-4 text-slate-900 placeholder-slate-500 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {searchFocused && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden z-50"
                  >
                    {searchSuggestions.map((suggestion, idx) => (
                      <Link
                        key={idx}
                        to={`/travel-activities/tours/${suggestion.slug}`}
                        className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <p className="font-semibold text-slate-900">{suggestion.label}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {suggestion.location}
                        </p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header with Controls */}
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Explore Tours
                </h2>
                <p className="text-slate-600">
                  {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""} available
                  {activeFilterCount > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                    </span>
                  )}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    showFilters
                      ? "bg-emerald-600 text-white"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <Filter size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-white border-2 border-slate-200 text-slate-700 font-semibold focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchTerm && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm">
                    <Search size={14} />
                    {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {durationFilter.length > 0 && durationFilter.map(filter => (
                  <div key={filter} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm">
                    <Clock size={14} />
                    {durationOptions.find(o => o.id === filter)?.label}
                    <button
                      onClick={() => setDurationFilter(prev => prev.filter(f => f !== filter))}
                      className="ml-1 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {ratingFilter > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm">
                    <Star size={14} />
                    {ratingFilter}+ Rating
                    <button
                      onClick={() => setRatingFilter(0)}
                      className="ml-1 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-10 overflow-hidden rounded-2xl bg-white border-2 border-slate-200 shadow-lg"
              >
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 text-lg">Travel Style</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setActiveFilter(category.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-all ${
                              activeFilter === category.id
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="text-lg mr-2">{category.icon}</span>
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 text-lg">Price Range</h3>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full accent-emerald-600"
                        />
                        <div className="flex justify-between text-sm text-slate-600">
                          <span className="font-semibold">${priceRange[0]}</span>
                          <span className="font-semibold">${priceRange[1]}</span>
                        </div>
                        <div className="text-xs text-slate-500 text-center">
                          Drag to adjust max price
                        </div>
                      </div>
                    </div>

                    {/* Duration Filter */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 text-lg">Duration</h3>
                      <div className="space-y-2">
                        {durationOptions.map((option) => (
                          <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={durationFilter.includes(option.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDurationFilter([...durationFilter, option.id]);
                                } else {
                                  setDurationFilter(durationFilter.filter(f => f !== option.id));
                                }
                              }}
                              className="w-4 h-4 rounded border-2 border-emerald-600 accent-emerald-600 cursor-pointer"
                            />
                            <span className="text-slate-700 group-hover:text-emerald-600 transition-colors font-semibold">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 text-lg">Minimum Rating</h3>
                      <div className="space-y-2">
                        {[0, 3, 3.5, 4, 4.5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setRatingFilter(rating === 0 ? 0 : rating)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                              ratingFilter === rating
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {rating === 0 ? (
                              <>
                                <span>All Ratings</span>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={i < Math.floor(rating) ? "fill-current" : ""}
                                    />
                                  ))}
                                </div>
                                <span>{rating}+</span>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2.5 text-slate-700 font-semibold hover:text-slate-900 transition-colors"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Carousel */}
          {activeFilter === "all" && (
            <div className="mb-10 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.slice(0, -1).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className="flex-shrink-0 inline-flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{category.name}</p>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tours Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"
              />
            </div>
          ) : (
            <>
              {filteredTours.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-5xl mb-4">🚫</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No tours found</h3>
                  <p className="text-slate-600 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredTours.map((tour, index) => (
                    <motion.div
                      key={tour.slug || tour.public_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      layout
                    >
                      <TourCardEnhanced
                        tour={tour}
                        isFavorite={favorites.includes(tour.public_id)}
                        onToggleFavorite={() => toggleFavorite(tour.public_id)}
                        isNew={tour.isNew}
                        isBestseller={tour.reviews > 50 && tour.rating >= 4.5}
                        trendingUp={tour.bookingsTrend === "up"}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* Pagination or Load More */}
          {filteredTours.length > 0 && filteredTours.length < tours.length && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                Load More Tours
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose EverTrek
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience Nepal with trusted experts who blend authentic local knowledge
              with world-class service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "👨‍🏫",
                title: "Expert Local Guides",
                description: "Decades of experience and intimate knowledge of Nepal's hidden gems",
              },
              {
                icon: "👥",
                title: "Small Group Sizes",
                description: "Limited groups ensure personalized attention and authentic experiences",
              },
              {
                icon: "⭐",
                title: "Premium Accommodations",
                description: "Best available lodges and teahouses with comfortable amenities",
              },
              {
                icon: "🛡️",
                title: "100% Safe & Secure",
                description: "All tours are insured with 24/7 emergency support team",
              },
              {
                icon: "💚",
                title: "Eco-Conscious Travel",
                description: "Supporting local communities and sustainable tourism practices",
              },
              {
                icon: "📱",
                title: "Easy Booking Platform",
                description: "Seamless booking experience with flexible payment options",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Can't Find Your Perfect Tour?</h2>
          <p className="text-lg mb-8 text-emerald-50">
            Our travel experts can customize any tour to match your preferences, budget, and timeline.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/plan"
              className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all"
            >
              Plan Custom Trip
            </Link>
            <Link
              to="/contact-us"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default TourIndexPage;