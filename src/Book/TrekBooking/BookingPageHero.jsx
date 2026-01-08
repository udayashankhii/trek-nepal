import React from "react";
import { Mountain, Clock, Star, MapPin } from "lucide-react";

/**
 * BookingPageHero Component
 * Displays hero section with trek information from API
 * @param {Object} hero - Hero data (title, subtitle, imageUrl, duration, difficulty, location)
 * @param {Object} trek - Trek data (rating, reviews)
 */
export default function BookingPageHero({ hero, trek }) {
  if (!hero || !trek) return null;

  return (
    <div className="relative h-96 bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      <img
        src={hero.imageUrl}
        alt={hero.title}
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        onError={(e) => {
          e.target.src = "/images/default-hero.jpg";
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Mountain className="w-6 h-6" />
            <span className="text-sm font-medium tracking-wider">
              ADVENTURE AWAITS
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>

          {hero.subtitle && <p className="mb-6 text-lg">{hero.subtitle}</p>}

          <div className="flex items-center space-x-6 text-lg flex-wrap gap-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{hero.duration}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Mountain className="w-5 h-5" />
              <span>{hero.difficulty}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>
                {trek?.rating ?? "N/A"} ({trek?.reviews ?? 0} reviews)
              </span>
            </div>

            {hero.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{hero.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
