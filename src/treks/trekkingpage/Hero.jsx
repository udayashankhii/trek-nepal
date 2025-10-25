// src/trekkingpage/HeroSection.jsx
import React from "react";
import { MapPinIcon, CalendarIcon, FireIcon } from "@heroicons/react/24/outline";

export default function HeroSection({
  title = "Everest Base Camp Trek",
  subtitle = "Follow in the footsteps of legends through Sherpa villages & Himalayan panoramas.",
  imageUrl,
  ctaLabel = "Book This Trek",
  season,
  duration,
  difficulty,
  location,
  onBookNow,
  onInquiry
}) {
  // Fallback image if none provided
  const displayImage = imageUrl || "/everest.jpeg";

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Image - Dynamic from API */}
      <img
        src={displayImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        loading="eager"
        onError={(e) => {
          e.target.src = "/everest.jpeg"; // Fallback on error
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Location & Season Badge */}
        {(location || season) && (
          <span className="mb-4 inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-full backdrop-blur">
            {location} {location && season && "•"} {season}
          </span>
        )}

        {/* Title - Dynamic */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          {title}
        </h1>

        {/* Subtitle - Dynamic */}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {subtitle}
          </p>
        )}

        {/* Trek Info Badges - Dynamic */}
        <div className="flex flex-wrap justify-center gap-4 text-white mb-6">
          {duration && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              <CalendarIcon className="h-5 w-5" />
              {duration}
            </span>
          )}
          {difficulty && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              <FireIcon className="h-5 w-5" />
              {difficulty}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              <MapPinIcon className="h-5 w-5" />
              {location}
            </span>
          )}
        </div>

        {/* CTA Buttons - Dynamic actions */}
        <div className="flex gap-4">
          {onBookNow && (
            <button
              onClick={onBookNow}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            >
              {ctaLabel}
            </button>
          )}
          {onInquiry && (
            <button
              onClick={onInquiry}
              className="px-8 py-3 rounded-full bg-white/10 backdrop-blur text-white font-bold text-lg shadow-lg hover:bg-white/20 transition-all"
            >
              Inquire Now
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
