// src/components/RegionCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function RegionCard({
  name,
  image,
  description,
  itinerariesCount,
  link,
}) {
  return (
    <Link to={link} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
      >
        <div className="w-full h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-lg">
            {name}
          </h3>
          <p className="text-sm md:text-base mb-2 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {itinerariesCount} Itineraries
            </span>
            <motion.span whileHover={{ x: 4 }} className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </motion.span>
          </div>
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

RegionCard.defaultProps = {
  itinerariesCount: 0,
  description: "",
};
