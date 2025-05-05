import React from "react";
import { Star, Calendar, Users, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Badge color map for flexibility
const badgeColors = {
  "GROUP TOURS": "bg-green-600",
  "BEST PRICE": "bg-red-600",
  FEATURED: "bg-orange-500",
  LUXURY: "bg-yellow-600",
  PREMIUM: "bg-rose-600",
  "HELI RETURN": "bg-blue-700",
};

function TrekCard({
  id,
  image,
  title,
  days,
  price,
  reviews,
  rating = 5,
  badge,
  region,
  maxGroupSize = 12,
  isFavorite = false,
  onFavorite,
}) {
  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group">
      {/* Favorite button */}
      {onFavorite && (
        <button
          onClick={() => onFavorite(id)}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-yellow-100 transition"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>
      )}

      {/* Badge */}
      {badge && (
        <span
          className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full text-white shadow ${
            badgeColors[badge] || "bg-gray-700"
          }`}
        >
          {badge}
        </span>
      )}

      {/* Image */}
      <Link to={`/treks/${id}`} className="relative block">
        <img
          src={image}
          alt={title}
          className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <Link
          to={`/treks/${id}`}
          className="text-xl font-semibold text-gray-900 hover:text-blue-700 transition"
        >
          {title}
        </Link>
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          {region && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              {region}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            {days} Days
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-600" />
            Max {maxGroupSize}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-gray-600 text-sm">({reviews})</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-lg text-blue-700">US${price}</span>
          <Link
            to={`/treks/${id}`}
            className="text-blue-700 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
export default TrekCard;
