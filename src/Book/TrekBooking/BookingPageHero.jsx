// src/pages/BookingPage/BookingPageHero.jsx
import React from "react";
import { Mountain, Clock, Star, MapPin } from "lucide-react";

/**
 * ✅ FIXED: BookingPageHero Component with proper null checks
 */
export default function BookingPageHero({ hero, trek }) {
  // ✅ Check if hero has actual data, not just empty object
  const hasHeroData = hero && Object.keys(hero).length > 0 && hero.title;
  const hasTrekData = trek && Object.keys(trek).length > 0;

  if (!hasHeroData || !hasTrekData) {
    
    // ✅ Render fallback hero instead of null
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider">
                ADVENTURE AWAITS
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              {trek?.title || trek?.name || "Complete Your Booking"}
            </h1>
            
            <p className="mb-6 text-lg max-w-3xl">
              Fill in your details below to secure your trek adventure
            </p>
            
            <div className="flex items-center space-x-6 text-lg flex-wrap gap-y-2">
              {trek?.duration && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{trek.duration}</span>
                </div>
              )}
              
              {(trek?.difficulty || trek?.trek_grade) && (
                <div className="flex items-center space-x-2">
                  <Mountain className="w-5 h-5" />
                  <span>{trek.difficulty || trek.trek_grade}</span>
                </div>
              )}
              
              {trek?.rating && (
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>
                    {trek.rating} ({trek.reviews || trek.review_count || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Hero data exists - render full version
  return (
    <div className="relative h-96 bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />

      {hero.imageUrl && (
        <img
          src={hero.imageUrl}
          alt={hero.title || "Trek Hero"}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Mountain className="w-6 h-6" />
            <span className="text-sm font-medium tracking-wider">
              ADVENTURE AWAITS
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>

          {hero.subtitle && (
            <p className="mb-6 text-lg max-w-3xl">{hero.subtitle}</p>
          )}

          <div className="flex items-center space-x-6 text-lg flex-wrap gap-y-2">
            {hero.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{hero.duration}</span>
              </div>
            )}

            {hero.difficulty && (
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5" />
                <span>{hero.difficulty}</span>
              </div>
            )}

            {(trek.rating || hero.rating) && (
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>
                  {trek.rating || hero.rating} ({trek.reviews || trek.review_count || 0} reviews)
                </span>
              </div>
            )}

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
