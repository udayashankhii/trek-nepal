// src/components/RegionCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { MapPin, Users, Clock } from "lucide-react";

export default function RegionCard({
  name,
  image,
  description = "",
  itinerariesCount = 0,
  link,
}) {
  return (
    <Link to={link} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}

          {/* Itineraries / Meta */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{itinerariesCount} Itineraries</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="capitalize">{name.split(" ")[0]}</span>
            </div>
          </div>

          {/* Call-to-action */}
          <motion.div
            whileHover={{ x: 4 }}
            className="mt-2 inline-block text-indigo-600 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            Explore
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

RegionCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  itinerariesCount: PropTypes.number,
  description: PropTypes.string,
};
