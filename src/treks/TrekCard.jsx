// src/components/TrekCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

/**
 * TrekCard
 * Displays summary info for a single trek, clickable to its detail page.
 * Props:
 *   - trek: { slug, title, image, badge?, days, price, rating, reviews }
 *   - region: string (e.g. "everest")
 */
export default function TrekCard({ trek, region }) {
  const priceValue =
    typeof trek.price === "object" ? trek.price?.base : trek.price;

  return (
    <Link to={`/treks/${region}/${trek.slug}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <img
            src={trek.image}
            alt={trek.title}
            className="object-cover w-full h-full"
          />
          {trek.badge && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
              {trek.badge}
            </span>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
            {trek.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <span>{trek.days} days</span>
            <span>•</span>
            <span>${priceValue}</span>
          </div>

          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(trek.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({trek.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

TrekCard.propTypes = {
  region: PropTypes.string.isRequired,
  trek: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    badge: PropTypes.string,
    days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    price: PropTypes.oneOfType([
      PropTypes.shape({
        base: PropTypes.number.isRequired,
      }),
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
  }).isRequired,
};
