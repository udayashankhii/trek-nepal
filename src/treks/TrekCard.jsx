// src/components/TrekCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, Users, Mountain } from "lucide-react";
import PropTypes from "prop-types";

/**
 * TrekCard
 * Displays summary info for a single trek, clickable to its detail page.
 * Enhanced with search functionality while maintaining existing compatibility.
 * Props:
 *   - trek: { slug, title, image, badge?, days, price, rating, reviews, ... }
 *   - region: string (e.g. "everest") - optional, can be derived from trek data
 *   - variant: "compact" | "detailed" (default: "compact")
 *   - showDetails: boolean (default: false) - shows additional trek info
 */
export default function TrekCard({ 
  trek, 
  region, 
  variant = "compact", 
  showDetails = false 
}) {
  // Handle different price formats
  const priceValue = typeof trek.price === "object" ? trek.price?.base : trek.price;
  const originalPrice = typeof trek.price === "object" ? trek.price?.original : null;
  
  // Derive region from trek data if not provided
  const trekRegion = region || trek.region || "everest";
  
  // Handle different title/name formats
  const trekTitle = trek.title || trek.name;
  
  // Handle different duration formats
  const trekDays = trek.days || trek.duration;
  
  // Handle different review formats
  const reviewCount = trek.reviews || trek.reviewCount || 0;

  // Get difficulty color styling
  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-100 text-gray-800";
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return "bg-green-100 text-green-800";
      case 'moderate':
        return "bg-blue-100 text-blue-800";
      case 'strenuous':
      case 'challenging':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link to={`/treks/${trekRegion}/${trek.slug}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <img
            src={trek.image}
            alt={trekTitle}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Badge */}
          {trek.badge && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              {trek.badge}
            </span>
          )}
          
          {/* Featured badge */}
          {trek.featured && !trek.badge && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              Featured
            </span>
          )}
          
          {/* Discount badge */}
          {originalPrice && originalPrice > priceValue && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Save ${originalPrice - priceValue}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {trekTitle}
          </h3>

          {/* Basic Info */}
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <Clock className="w-4 h-4" />
            <span>{trekDays} days</span>
            <span>•</span>
            <span className="font-semibold text-indigo-600">${priceValue}</span>
            {originalPrice && originalPrice > priceValue && (
              <span className="text-gray-400 line-through text-xs">
                ${originalPrice}
              </span>
            )}
          </div>

          {/* Enhanced Details for Search Results */}
          {(showDetails || variant === "detailed") && (
            <>
              {/* Description */}
              {trek.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {trek.description}
                </p>
              )}
              
              {/* Additional Trek Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {trek.maxAltitude && (
                  <div className="flex items-center">
                    <Mountain className="w-3 h-3 mr-1" />
                    <span>{trek.maxAltitude}m</span>
                  </div>
                )}
                {trek.groupSize && (
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{trek.groupSize}</span>
                  </div>
                )}
                {trek.region && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="capitalize">{trek.region}</span>
                  </div>
                )}
              </div>

              {/* Difficulty Badge */}
              {trek.difficulty && (
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(trek.difficulty)}`}>
                    {trek.difficulty}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(trek.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {trek.rating} ({reviewCount})
              </span>
            </div>
            
            {/* Availability indicator */}
            {trek.availability !== undefined && (
              <div className={`w-2 h-2 rounded-full ${
                trek.availability ? 'bg-green-400' : 'bg-red-400'
              }`} title={trek.availability ? 'Available' : 'Not Available'} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

TrekCard.propTypes = {
  region: PropTypes.string,
  variant: PropTypes.oneOf(["compact", "detailed"]),
  showDetails: PropTypes.bool,
  trek: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string.isRequired,
    badge: PropTypes.string,
    featured: PropTypes.bool,
    days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([
      PropTypes.shape({
        base: PropTypes.number.isRequired,
        original: PropTypes.number,
      }),
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number,
    reviewCount: PropTypes.number,
    description: PropTypes.string,
    difficulty: PropTypes.string,
    region: PropTypes.string,
    maxAltitude: PropTypes.number,
    groupSize: PropTypes.string,
    availability: PropTypes.bool,
  }).isRequired,
};
