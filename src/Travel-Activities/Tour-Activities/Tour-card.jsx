import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  ArrowRight,
  TrendingUp,
  Shield
} from "lucide-react";

/**
 * Enhanced Tour Card Component
 * - Premium visual design with micro-interactions
 * - Better information hierarchy
 * - Improved mobile responsiveness
 * - Accessibility enhancements
 */
export default function TourCard({ 
  tour, 
  isFavorite, 
  onToggleFavorite,
  isNew = false,
  isBestseller = false,
  trendingUp = false 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount percentage if applicable
  const discountPercent = tour.oldPrice && tour.price 
    ? Math.round(((tour.oldPrice - tour.price) / tour.oldPrice) * 100)
    : 0;

  const ratingColor = tour.rating >= 4.5 
    ? "text-emerald-500" 
    : tour.rating >= 4 
    ? "text-amber-500" 
    : "text-blue-500";

  return (
    <div 
      className="group h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-emerald-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden bg-slate-100 h-56 md:h-64">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
        )}

        {/* Main Image */}
        <Link 
          to={`/travel-activities/tours/${tour.slug}`}
          className="block w-full h-full"
        >
          <img
            src={tour.image}
            alt={tour.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-70"
        }`} />

        {/* Badge Section */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isNew && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              🆕 New
            </span>
          )}
          {isBestseller && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              ⭐ Bestseller
            </span>
          )}
          {trendingUp && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <TrendingUp size={12} /> Trending
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2.5 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-300 ${
              isFavorite 
                ? "fill-rose-500 text-rose-500" 
                : "text-slate-400 hover:text-rose-500"
            }`}
          />
        </button>

        {/* CTA Overlay on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <Link
            to={`/travel-activities/tours/${tour.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg transition-all hover:gap-3 hover:bg-emerald-50"
          >
            View Details
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Tag Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {tour.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Location & Category */}
        <div className="mb-2 flex items-center gap-1.5">
          <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            {tour.location}
          </p>
        </div>

        {/* Title */}
        <Link
          to={`/travel-activities/tours/${tour.slug}`}
          className="mb-2 block text-lg font-bold text-slate-900 transition-colors hover:text-emerald-700 line-clamp-2"
        >
          {tour.title}
        </Link>

        {/* Tagline */}
        {tour.tagline && (
          <p className="mb-3 text-sm text-slate-600 line-clamp-2">
            {tour.tagline}
          </p>
        )}

        {/* Quick Info - Duration & Group Size */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Calendar size={14} className="text-slate-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-700">
              {tour.duration}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Users size={14} className="text-slate-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-700">
              Max {tour.groupSize}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-4 border-t border-slate-100" />

        {/* Rating Section */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(tour.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className={`font-bold ${ratingColor}`}>
            {tour.rating?.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({tour.reviews ?? 0})
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-baseline gap-2">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-700">
                ${Number(tour.price ?? 0).toFixed(0)}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs line-through text-slate-400">
                  ${Number(tour.oldPrice ?? 0).toFixed(0)}
                </span>
              )}
            </div>
          </div>
          {tour.rating >= 4.5 && (
            <div className="ml-auto flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1.5">
              <Shield size={12} className="text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-700">
                Recommended
              </span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto flex gap-2 pt-4">
          <Link
            to={`/travel-activities/tours/${tour.slug}`}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Book Now
          </Link>
          <Link
            to="/plan"
            className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-200 px-3 py-2.5 font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            title="Customize this tour"
          >
            <span className="text-lg">⚙️</span>
          </Link>
        </div>
      </div>
    </div>
  );
}