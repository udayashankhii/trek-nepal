// src/components/treks/TrekCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, Users, Mountain } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { fetchTrekBookingCard } from "../api/trekService";

export default function TrekCard({
  trek,
  region,
  variant = "compact",
  showDetails = false
}) {
  const trekSlug = trek.slug;
  const trekTitle = trek.title || trek.name;
  const trekImage = trek.hero?.imageUrl || trek.card_image_url || trek.image || "/fallback.jpg";
  const trekRegion = region || trek.region || "everest";
  const trekRating = Number(trek.rating) || 0;
  const reviewCount = Number(trek.reviews) || trek.reviewCount || 0;

  // ===== FRONTEND-ONLY PRICE FIX =====
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
  const [asyncPriceData, setAsyncPriceData] = useState(null);

  // PRIORITY ORDER:
  // 1. Direct trek.price (used in similar treks & list views)
  // 2. booking_card.base_price (used in detail views)
  // 3. trek.base_price (fallback)
  const initialBasePrice = parsePrice(
    trek.price ||                    // ← Check this FIRST
    bookingCard.base_price ||
    trek.base_price ||
    0
  );

  const initialOriginalPrice = parsePrice(
    bookingCard.original_price ||
    trek.original_price ||
    null
  );

  // Fetch price if missing
  useEffect(() => {
    let isMounted = true;

    // Only fetch if we have a slug but NO valid price
    const shouldFetch = initialBasePrice === 0 && trekSlug;

    if (shouldFetch) {
      fetchTrekBookingCard(trekSlug)
        .then(data => {
          if (isMounted && data) {
            setAsyncPriceData({
              base: parsePrice(data.base_price),
              original: parsePrice(data.original_price)
            });
          }
        })
        .catch(err => console.warn(`Failed to fetch price for ${trekSlug}`, err));
    }

    return () => { isMounted = false; };
  }, [trekSlug, initialBasePrice]);

  // Merge initial vs async prices
  const basePrice = asyncPriceData ? asyncPriceData.base : initialBasePrice;
  const originalPrice = asyncPriceData ? asyncPriceData.original : initialOriginalPrice;
  // ===== END PRICE HANDLING =====

  const duration = trek.duration || trek.days;
  const parseDuration = (durationStr) => {
    if (!durationStr) return null;
    const match = String(durationStr).match(/(\d+)/);
    return match ? match[1] : durationStr;
  };
  const trekDays = parseDuration(duration);

  const trekGrade = trek.trek_grade || trek.trip_grade || trek.difficulty;
  const maxAltitude = trek.max_altitude || trek.maxAltitude;
  const groupSize = trek.group_size || trek.groupSize;
  const badge = trek.badge || bookingCard.badge_label;
  const featured = trek.featured;

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
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden
                   border border-slate-200/70 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]
                   group-hover:shadow-[0_18px_50px_-22px_rgba(15,23,42,0.50)]
                   transition-shadow"
      >
        <div className="relative h-48 w-full">
          <img
            src={trekImage}
            alt={trekTitle}
            loading="lazy"
            className="object-cover w-full h-full scale-[1.01] group-hover:scale-105
                       transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = "/fallback.jpg";
            }}
          />

          {badge && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              {badge}
            </span>
          )}

          {featured && !badge && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              Featured
            </span>
          )}

          {basePrice > 0 && originalPrice > 0 && originalPrice > basePrice && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Save ${(originalPrice - basePrice).toFixed(0)}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {trekTitle}
          </h3>

          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <Clock className="w-4 h-4" />
            <span>{trekDays} days</span>
            <span>•</span>

            {(basePrice > 0 || (originalPrice > 0)) ? (
              <>
                <span className="font-semibold text-indigo-600">
                  ${(basePrice > 0 ? basePrice : originalPrice).toFixed(0)}
                </span>
                {basePrice > 0 && originalPrice > 0 && originalPrice > basePrice && (
                  <span className="text-gray-400 line-through text-xs">
                    ${originalPrice.toFixed(0)}
                  </span>
                )}
              </>
            ) : (
              <span className="font-semibold text-gray-500 text-xs">
                Contact for Price
              </span>
            )}
          </div>

          {(showDetails || variant === "detailed") && (
            <>
              {trek.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {trek.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {maxAltitude && (
                  <div className="flex items-center">
                    <Mountain className="w-3 h-3 mr-1" />
                    <span>{maxAltitude}</span>
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

              {trekGrade && (
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(trekGrade)}`}>
                    Grade {trekGrade}
                  </span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(trekRating)
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

            {trek.availability !== undefined && (
              <div className={`w-2 h-2 rounded-full ${trek.availability ? 'bg-green-400' : 'bg-red-400'
                }`} title={trek.availability ? 'Available' : 'Not Available'} />
            )}
          </div>
        </div>
      </motion.div>
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
      base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      original_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      badge_label: PropTypes.string,
    }),
    base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    original_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};
