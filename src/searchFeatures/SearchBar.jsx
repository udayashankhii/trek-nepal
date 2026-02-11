import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp, MapPin, Calendar, Mountain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import { debounce } from "../api/service/Debounce";

const TRENDING_SEARCHES = [
  { text: "Everest Base Camp", icon: Mountain, type: "trek" },
  { text: "Annapurna Circuit", icon: Mountain, type: "trek" },
  { text: "Manaslu Trek", icon: Mountain, type: "trek" },
  { text: "Langtang Valley", icon: MapPin, type: "trek" },
];

export default function SearchBar({ isHeroVersion = false, onFocus, onBlur }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Fetch search results
  const fetchResults = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          scope: "both",
          limit: "8",
        });

        const response = await fetch(`/api/search/?${params.toString()}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (query) {
      fetchResults(query);
    } else {
      setResults(null);
    }
  }, [query, fetchResults]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
    onFocus?.();
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    inputRef.current?.focus();
  };

  const handleTrendingClick = (searchText) => {
    setQuery(searchText);
    inputRef.current?.focus();
  };

  const handleResultClick = (result) => {
    setIsOpen(false);
    setIsFocused(false);
    onBlur?.();

    // Navigate based on result type
    let fullPath;
    if (result.type === "trek") {
      const region = result.region_slug || result.region?.toLowerCase() || "general";
      fullPath = `/treks/${region}/${result.slug}`;
    } else {
      // Tours follow /travel-activities/tours/:slug
      fullPath = `/travel-activities/tours/${result.slug}`;
    }

    navigate(fullPath);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    setIsFocused(false);
    onBlur?.();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* Backdrop Overlay - Blocks clicks to elements behind */}
      {(isOpen || isFocused) && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          style={{
            zIndex: 998,  // Just below search container
            opacity: (isOpen || isFocused) ? 1 : 0
          }}
          onClick={() => {
            setIsOpen(false);
            setIsFocused(false);
            onBlur?.();
          }}
        />
      )}

      {/* Search Container */}
      <div
        ref={searchRef}
        className={`relative w-full transition-all duration-500 ${isHeroVersion ? "max-w-3xl mx-auto" : "max-w-2xl"
          }`}
        style={{
          zIndex: 999  // Above backdrop
        }}
      >
        {/* Search Input Container */}
        <div
          className={`
            relative group
            transition-all duration-500 ease-out
            ${isFocused ? "scale-[1.02]" : "scale-100"}
          `}
        >
          {/* Glass Background */}
          <div
            className={`
              absolute inset-0 rounded-2xl overflow-hidden
              transition-all duration-500
              ${isFocused
                ? "bg-white/95 backdrop-blur-2xl shadow-2xl shadow-black/10 ring-2 ring-emerald-500/20"
                : "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl"
              }
            `}
          />

          {/* Input Wrapper */}
          <div className="relative flex items-center">
            {/* Search Icon */}
            <div
              className={`
                absolute left-6 transition-all duration-300
                ${isFocused ? "text-emerald-600 scale-110" : "text-gray-400 group-hover:text-gray-600"}
              `}
            >
              <Search className="w-5 h-5" strokeWidth={2.5} />
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder={
                isHeroVersion
                  ? "Search treks and tours..."
                  : "Where would you like to go?"
              }
              className="w-full pl-16 pr-16 py-5 bg-transparent relative z-10 text-gray-900 placeholder-gray-400 text-base font-medium transition-all duration-300 focus:outline-none"
            />

            {/* Clear Button */}
            {query && (
              <div className="absolute right-4 z-10">
                <button
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Active Indicator */}
          {isFocused && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div
            className={`
              absolute top-full mt-4 w-full
              bg-white/95 backdrop-blur-2xl
              rounded-2xl shadow-2xl shadow-black/10
              border border-gray-100
              overflow-y-auto overflow-x-hidden
              transition-all duration-500 ease-out
              scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent
              ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            `}
            style={{
              maxHeight: "max(400px, calc(100vh - 200px))",
              zIndex: 1000,
              scrollbarWidth: 'thin',
              msOverflowStyle: 'none'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.1);
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.2);
              }
            `}</style>
            {/* Trending / No Query State */}
            {!query && (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Trending Searches
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {TRENDING_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTrendingClick(item.text)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left group"
                    >
                      <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && query && (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="mt-4 text-sm text-gray-500 font-medium">Searching...</p>
              </div>
            )}

            {/* Results */}
            {!loading && results && (
              <SearchResults
                results={results.results || []}
                query={query}
                totalResults={results.total}
                onResultClick={handleResultClick}
                onViewAll={handleViewAll}
                suggestions={results.suggestions}
                fallback={results.fallback}
              />
            )}

            {/* No Results */}
            {!loading && query && results && results.results?.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your search or browse our suggestions below
                </p>
                {results.suggestions && results.suggestions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Suggested Treks
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {results.suggestions.slice(0, 3).map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleResultClick(suggestion)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left"
                        >
                          <Mountain className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {suggestion.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}