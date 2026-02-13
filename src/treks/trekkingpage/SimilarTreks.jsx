// src/trekkingpage/SimilarTreks.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Mountain, Users, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Trek Card Component - Styled to match the reference image
function SimilarTrekCard({ trek }) {
  // Safely handle image error
  const handleImageError = (e) => {
    e.target.src = "/trekking.png"; // Fallback image
  };

  // Parse price
  const parsePrice = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const basePrice = parsePrice(trek.price);
  const originalPrice = parsePrice(trek.originalPrice);

  // Difficulty color and text
  const getDifficultyStyles = (difficulty) => {
    if (!difficulty) return { bg: "bg-gray-100", text: "text-gray-800", label: "Moderate" };
    const diffLower = String(difficulty).toLowerCase();
    
    if (diffLower === 'easy' || diffLower === 'a') {
      return { bg: "bg-green-100", text: "text-green-800", label: "Easy" };
    }
    if (diffLower === 'moderate' || diffLower === 'b') {
      return { bg: "bg-blue-100", text: "text-blue-800", label: "Moderate" };
    }
    if (diffLower.includes('strenuous') || diffLower.includes('challenging') ||
      diffLower === 'hard' || diffLower === 'c') {
      return { bg: "bg-red-100", text: "text-red-800", label: "Challenging" };
    }
    return { bg: "bg-gray-100", text: "text-gray-800", label: difficulty };
  };

  const difficultyStyles = getDifficultyStyles(trek.difficulty);

  return (
    <Link to={trek.link || `/treks/${trek.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white rounded-2xl overflow-hidden
                   border border-slate-200 shadow-md
                   group-hover:shadow-xl
                   transition-all duration-300 h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={trek.image}
            alt={trek.title}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105
                       transition-transform duration-500 ease-out"
            onError={handleImageError}
          />

          {/* Save Badge - Top Right */}
          {basePrice > 0 && originalPrice > 0 && originalPrice > basePrice && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg">
              Save ${(originalPrice - basePrice).toFixed(0)}
            </span>
          )}

          {/* Other Badge - Top Left */}
          {trek.badge && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold uppercase px-3 py-1.5 rounded-md shadow-lg">
              {trek.badge}
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col space-y-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {trek.title}
          </h3>

          {/* Duration and Price Row */}
          <div className="flex items-center text-sm text-gray-700 gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{trek.duration}</span>
            <span className="text-gray-400">•</span>
            
            {(basePrice > 0 || originalPrice > 0) ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-600 text-base">
                  ${(basePrice > 0 ? basePrice : originalPrice).toFixed(0)}
                </span>
                {basePrice > 0 && originalPrice > 0 && originalPrice > basePrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ${originalPrice.toFixed(0)}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-semibold text-gray-500 text-sm">
                Price on request
              </span>
            )}
          </div>

          {/* Info Grid - 2 Rows */}
          <div className="space-y-2">
            {/* Row 1: Altitude and Group Size */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              {trek.maxAltitude && (
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{trek.maxAltitude}</span>
                </div>
              )}
              {trek.groupSize && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Up to {trek.groupSize}</span>
                </div>
              )}
            </div>

            {/* Row 2: Location */}
            {trek.region && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium capitalize">{trek.region}</span>
              </div>
            )}
          </div>

          {/* Difficulty Badge */}
          {trek.difficulty && (
            <div>
              <span className={`inline-block px-3 py-1.5 rounded-md text-sm font-semibold ${difficultyStyles.bg} ${difficultyStyles.text}`}>
                Grade {difficultyStyles.label}
              </span>
            </div>
          )}

          {/* Rating - at bottom */}
          <div className="flex items-center gap-2 mt-auto pt-2">
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
            <span className="text-sm font-semibold text-gray-700">
              {trek.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({trek.reviews})
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Main Component
export default function SimilarTreks({
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
        const image = trek.image || trek.card_image_url || trek.bannerImage || trek.thumbnail || trek.photo || '/trekking.png';
        const daysValue = trek.days || trek.durationDays;
        const duration = trek.duration || (daysValue ? `${daysValue} Days` : null);
        const rating = Number(trek.rating || trek.stars || trek.averageRating || 0);
        const reviews = Number(trek.reviews || trek.reviewCount || trek.reviewsCount || 0);
        
        // Price handling - same as TrekCard
        const parsePrice = (value) => {
          if (value === null || value === undefined || value === '') return 0;
          if (typeof value === 'string') {
            const cleaned = value.replace(/[^0-9.]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
          }
          const num = Number(value);
          return isNaN(num) ? 0 : num;
        };

        const bookingCard = trek.booking_card || {};
        const basePrice = parsePrice(
          trek.price ||
          bookingCard.base_price ||
          trek.base_price ||
          0
        );
        const originalPrice = parsePrice(
          bookingCard.original_price ||
          trek.original_price ||
          null
        );

        const badge = trek.badge || bookingCard.badge_label || trek.tag || trek.label || '';
        const slug = trek.slug || trek.url || '';
        const region = trek.region || trek.region_name || trek.location || trek.area || '';
        
        // Parse duration to get number of days
        const parseDuration = (durationStr) => {
          if (!durationStr) return null;
          const match = String(durationStr).match(/(\d+)/);
          return match ? `${match[1]} days` : durationStr;
        };

        const difficulty = trek.difficulty || trek.trek_grade || trek.trip_grade || '';
        const maxAltitude = trek.max_altitude || trek.maxAltitude || '';
        const groupSize = trek.group_size || trek.groupSize || '';

        // Construct link based on region and slug
        let link = trek.link;
        if (!link && slug && region) {
          link = `/treks/${region}/${slug}`;
        } else if (!link && slug) {
          link = `/treks/${slug}`;
        }

        return {
          id,
          title,
          image,
          duration: parseDuration(duration),
          rating,
          reviews,
          price: basePrice,
          originalPrice,
          badge,
          slug,
          link,
          region,
          difficulty,
          maxAltitude,
          groupSize
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
              to="/trekking-in-nepal"
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <TrendingUp size={20} />
              Explore All Treks
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}