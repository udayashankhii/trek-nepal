import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Star, Filter, SlidersHorizontal, X } from "lucide-react";
import SearchBar from "./SearchBar";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [fallback, setFallback] = useState(null);

  const query = searchParams.get("q") || "";
  const scope = searchParams.get("scope") || "both";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Filters
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    duration: "",
    difficulty: "",
    region: "",
  });

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query, scope, page]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        scope: scope,
        page: page.toString(),
        limit: "12",
        similar: "true"
      });

      const response = await fetch(`/api/search/?${params.toString()}`);
      const data = await response.json();

      setResults(data.results || []);
      setTotalResults(data.total || 0);
      setSuggestions(data.suggestions || []);
      setFallback(data.fallback || null);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScopeChange = (newScope) => {
    setSearchParams({ q: query, scope: newScope, page: "1" });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, scope: scope, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResultClick = (result) => {
    const region = result.region_slug || result.region?.toLowerCase() || "general";
    const path = result.type === "trek"
      ? `/treks/${region}/${result.slug}`
      : `/travel-activities/tours/${result.slug}`;
    navigate(path);
  };

  const totalPages = Math.ceil(totalResults / 12);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              Find Your Next Adventure
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Search through hundreds of treks and tours in the Himalayas
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar isHeroVersion />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Scope Tabs */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
            {["both", "trek", "tour"].map((s) => (
              <button
                key={s}
                onClick={() => handleScopeChange(s)}
                className={`
                  px-6 py-2.5 rounded-lg font-semibold text-sm
                  transition-all duration-200
                  ${scope === s
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {s === "both" ? "All" : s.charAt(0).toUpperCase() + s.slice(1) + "s"}
              </button>
            ))}
          </div>

          {/* Results Count & Filters */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{totalResults}</span>{" "}
              {totalResults === 1 ? "result" : "results"} found
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Any</option>
                  <option value="1-5">1-5 days</option>
                  <option value="6-10">6-10 days</option>
                  <option value="11-15">11-15 days</option>
                  <option value="16+">16+ days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Any</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                  <option value="strenuous">Strenuous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, idx) => (
              <ResultCard
                key={result.id}
                result={result}
                onClick={() => handleResultClick(result)}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any treks or tours matching "{query}". Try
              different keywords or browse our popular adventures.
            </p>
            {suggestions.length > 0 && (
              <div className="mb-10 max-w-2xl mx-auto">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recommended for you</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestions.slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleResultClick(suggestion)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow text-left group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={suggestion.image_url || "/fallback.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">{suggestion.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg shadow-emerald-600/20"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === pageNum
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ result, onClick, index }) {
  const {
    title,
    subtitle,
    location,
    duration,
    rating,
    price,
    image_url,
    type,
    match_fields = [],
    region
  } = result;

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 text-left transform hover:-translate-y-2 border border-gray-100"
      style={{
        animation: `fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.05}s backwards`,
      }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
            <MapPin className="w-12 h-12 text-emerald-600" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg shadow-xl border border-white/50">
            {type}
          </span>
        </div>

        {/* Rating */}
        {rating && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-white/50">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">{rating}</span>
          </div>
        )}

        {/* Price Floating */}
        {price && (
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-0.5">Starting from</p>
            <p className="text-2xl font-black">${Math.round(price).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {match_fields.slice(0, 3).map((field, i) => (
            <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-md border border-emerald-100">
              {field}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-1 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{subtitle}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
          {(location || region) && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold">{location || region}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold">{duration}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
