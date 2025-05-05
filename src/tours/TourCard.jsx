import React from "react";
import { Star } from "lucide-react";

const TourCard = ({
  image,
  title,
  price,
  oldPrice,
  duration,
  rating,
  reviews,
  badge,
}) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group">
    {/* Badge */}
    {badge && (
      <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
        {badge}
      </span>
    )}

    {/* Image */}
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />

    {/* Content */}
    <div className="p-5 flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="font-bold text-green-700">US${price}</span>
        {oldPrice && (
          <span className="text-gray-400 line-through text-sm">US${oldPrice}</span>
        )}
        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
          P/P
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span role="img" aria-label="duration">🗓️</span> Duration: {duration}
      </div>
      <div className="flex items-center gap-1 text-green-700 font-medium text-sm">
        <Star className="w-4 h-4 fill-green-500" />
        {rating}
        <span className="text-gray-500 font-normal ml-1">
          ({reviews} reviews)
        </span>
      </div>
    </div>
  </div>
);

export default TourCard;
