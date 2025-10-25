// src/trekkingpage/SimilarItineraries.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Calendar, TrendingUp } from "lucide-react";

// Trek Card Component
function SimilarTrekCard({ trek }) {
  // Safely handle image error
  const handleImageError = (e) => {
    e.target.src = "/trekking.png"; // Fallback image
  };

  // Badge color logic
  const getBadgeStyles = (badge) => {
    const lowerBadge = badge?.toLowerCase() || "";
    
    if (lowerBadge.includes("best") || lowerBadge.includes("seller")) {
      return "bg-green-600 text-white";
    }
    if (lowerBadge.includes("price") || lowerBadge.includes("deal")) {
      return "bg-orange-600 text-white";
    }
    if (lowerBadge.includes("new") || lowerBadge.includes("featured")) {
      return "bg-blue-600 text-white";
    }
    if (lowerBadge.includes("popular")) {
      return "bg-purple-600 text-white";
    }
    return "bg-gray-700 text-white";
  };

  return (
    <article className="group bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={trek.image}
          alt={trek.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Badge */}
        {trek.badge && (
          <span className={`absolute top-3 left-3 ${getBadgeStyles(trek.badge)} text-xs px-3 py-1 rounded-full font-semibold shadow-lg`}>
            {trek.badge}
          </span>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {trek.duration && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {trek.duration}
            </span>
          )}
          
          {trek.rating > 0 && (
            <>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                {trek.rating.toFixed(1)}
              </span>
              {trek.reviews > 0 && (
                <span className="text-gray-400">({trek.reviews})</span>
              )}
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          {trek.title}
        </h3>

        {/* Region Badge */}
        {trek.region && (
          <div className="text-xs text-gray-500 font-medium">
            📍 {trek.region}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-sky-600 text-2xl font-bold">
            ${trek.price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">per person</span>
        </div>

        {/* View Details Link */}
        <Link
          to={trek.link || `/treks/${trek.slug}`}
          className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold hover:gap-2 transition-all group/link"
        >
          View Details 
          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

// Main Component
export default function SimilarItineraries({ 
  treks = [],
  title = "Similar Treks You Might Like",
  subtitle = "Explore more amazing trekking adventures",
  exploreLink = "/treks",
  currentTrekId = null,
  showHeader = true,
  maxItems = 3
}) {
  // Normalize treks from API
  const normalizedTreks = useMemo(() => {
    if (!Array.isArray(treks) || treks.length === 0) {
      return [];
    }

    return treks
      .filter(trek => {
        // Filter out current trek if ID provided
        if (currentTrekId && (trek.id === currentTrekId || trek._id === currentTrekId)) {
          return false;
        }
        return true;
      })
      .slice(0, maxItems) // Limit number of items
      .map((trek, index) => {
        // Handle different API response formats
        const id = trek.id || trek._id || `trek-${index}`;
        const title = trek.title || trek.name || 'Untitled Trek';
        const image = trek.image || trek.bannerImage || trek.thumbnail || trek.photo || '/trekking.png';
        const duration = trek.duration || trek.days || (trek.durationDays ? `${trek.durationDays} Days` : null);
        const rating = Number(trek.rating || trek.stars || trek.averageRating || 0);
        const reviews = Number(trek.reviews || trek.reviewCount || trek.reviewsCount || 0);
        const price = Number(trek.price || trek.basePrice || trek.cost || 0);
        const badge = trek.badge || trek.tag || trek.label || '';
        const slug = trek.slug || trek.url || '';
        const link = trek.link || `/treks/${slug}`;
        const region = trek.region || trek.location || trek.area || '';

        return {
          id,
          title,
          image,
          duration,
          rating,
          reviews,
          price,
          badge,
          slug,
          link,
          region
        };
      });
  }, [treks, currentTrekId, maxItems]);

  // Don't render if no treks
  if (normalizedTreks.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Trek Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {normalizedTreks.map((trek) => (
            <SimilarTrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        {/* Explore All Link */}
        {exploreLink && (
          <div className="text-center">
            <Link
              to={exploreLink}
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <TrendingUp size={20} />
              Explore All Treks
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
