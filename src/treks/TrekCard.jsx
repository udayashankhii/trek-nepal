
// src/components/treks/TrekCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, Users, Mountain } from "lucide-react";
import PropTypes from "prop-types";

export default function TrekCard({ 
  trek, 
  region, 
  variant = "compact", 
  showDetails = false 
}) {
  // Extract data EXACTLY like TrekDetailPage does
  const trekSlug = trek.slug;
  const trekTitle = trek.title || trek.name;
  
  // Image handling - match TrekDetailPage: hero.imageUrl OR card_image_url
  const trekImage = trek.hero?.imageUrl || trek.card_image_url || trek.image || "/fallback.jpg";
  
  // Region handling - match TrekDetailPage
  const trekRegion = region || trek.region || "everest";
  
  // Rating and reviews
  const trekRating = Number(trek.rating) || 0;
  const reviewCount = Number(trek.reviews) || trek.reviewCount || 0;
  
  // Price handling - match TrekDetailPage's booking_card structure
  const bookingCard = trek.booking_card || {};
  const basePrice = bookingCard.base_price || trek.base_price || trek.price || 0;
  const originalPrice = bookingCard.original_price || trek.original_price || null;
  
  // Duration handling - match TrekDetailPage
  const duration = trek.duration || trek.days;
  const parseDuration = (durationStr) => {
    if (!durationStr) return null;
    const match = String(durationStr).match(/(\d+)/);
    return match ? match[1] : durationStr;
  };
  const trekDays = parseDuration(duration);
  
  // Additional details - match TrekDetailPage's field names
  const trekGrade = trek.trek_grade || trek.trip_grade || trek.difficulty;
  const maxAltitude = trek.max_altitude || trek.maxAltitude;
  const groupSize = trek.group_size || trek.groupSize;
  const badge = trek.badge || bookingCard.badge_label;
  const featured = trek.featured;

  // Get difficulty color styling
  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-100 text-gray-800";
    
    const diffLower = String(difficulty).toLowerCase();
    
    if (diffLower === 'easy' || diffLower === 'a') {
      return "bg-green-100 text-green-800";
    }
    if (diffLower === 'moderate' || diffLower === 'b') {
      return "bg-blue-100 text-blue-800";
    }
    if (diffLower.includes('strenuous') || diffLower.includes('challenging') || 
        diffLower === 'hard' || diffLower === 'c') {
      return "bg-red-100 text-red-800";
    }
    
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Link to={`/treks/${trekRegion}/${trekSlug}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <img
            src={trekImage}
            alt={trekTitle}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/fallback.jpg";
            }}
          />
          
          {/* Badge */}
          {badge && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              {badge}
            </span>
          )}
          
          {/* Featured badge */}
          {featured && !badge && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              Featured
            </span>
          )}
          
          {/* Discount badge */}
          {originalPrice && Number(originalPrice) > Number(basePrice) && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Save ${(Number(originalPrice) - Number(basePrice)).toFixed(0)}
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
            <span className="font-semibold text-indigo-600">${Number(basePrice).toFixed(0)}</span>
            {originalPrice && Number(originalPrice) > Number(basePrice) && (
              <span className="text-gray-400 line-through text-xs">
                ${Number(originalPrice).toFixed(0)}
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
                {maxAltitude && (
                  <div className="flex items-center">
                    <Mountain className="w-3 h-3 mr-1" />
                    <span>{maxAltitude}m</span>
                  </div>
                )}
                {groupSize && (
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Up to {groupSize}</span>
                  </div>
                )}
                {trekRegion && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="capitalize">{trekRegion}</span>
                  </div>
                )}
              </div>

              {/* Difficulty Badge */}
              {trekGrade && (
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(trekGrade)}`}>
                    Grade {trekGrade}
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
                      i < Math.round(trekRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {trekRating.toFixed(1)} ({reviewCount})
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
    public_id: PropTypes.string,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    card_image_url: PropTypes.string,
    image: PropTypes.string,
    hero: PropTypes.shape({
      imageUrl: PropTypes.string,
    }),
    badge: PropTypes.string,
    featured: PropTypes.bool,
    days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reviews: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reviewCount: PropTypes.number,
    description: PropTypes.string,
    difficulty: PropTypes.string,
    trip_grade: PropTypes.string,
    trek_grade: PropTypes.string,
    region: PropTypes.string,
    region_name: PropTypes.string,
    max_altitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxAltitude: PropTypes.number,
    group_size: PropTypes.string,
    groupSize: PropTypes.string,
    availability: PropTypes.bool,
    booking_card: PropTypes.shape({
      base_price: PropTypes.string,
      original_price: PropTypes.string,
      badge_label: PropTypes.string,
    }),
    base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    original_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};