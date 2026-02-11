// // src/trekkingpage/HeroSection.jsx
// import React from "react";
// import { MapPinIcon, CalendarIcon, FireIcon } from "@heroicons/react/24/outline";

// export default function HeroSection({
//   title = "Everest Base Camp Trek",
//   subtitle = "Follow in the footsteps of legends through Sherpa villages & Himalayan panoramas.",
//   imageUrl,
//   ctaLabel = "Book This Trek",
//   season,
//   duration,
//   difficulty,
//   location,
//   onBookNow,
//   onInquiry
// }) {
//   // Fallback image if none provided
//   const displayImage = imageUrl || "/everest.jpeg";

//   return (
//     <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
//       {/* Background Image - Dynamic from API */}
//       <img
//         src={displayImage}
//         alt={title}
//         className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
//         loading="eager"
//         onError={(e) => {
//           e.target.src = "/everest.jpeg"; // Fallback on error
//         }}
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />

//       {/* Main Content */}
//       <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
//         {/* Location & Season Badge */}
//         {(location || season) && (
//           <span className="mb-4 inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-full backdrop-blur">
//             {location} {location && season && "•"} {season}
//           </span>
//         )}

//         {/* Title - Dynamic */}
//         <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
//           {title}
//         </h1>

//         {/* Subtitle - Dynamic */}
//         {subtitle && (
//           <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
//             {subtitle}
//           </p>
//         )}

//         {/* Trek Info Badges - Dynamic */}
//         <div className="flex flex-wrap justify-center gap-4 text-white mb-6">
//           {duration && (
//             <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
//               <CalendarIcon className="h-5 w-5" />
//               {duration}
//             </span>
//           )}
//           {difficulty && (
//             <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
//               <FireIcon className="h-5 w-5" />
//               {difficulty}
//             </span>
//           )}
//           {location && (
//             <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
//               <MapPinIcon className="h-5 w-5" />
//               {location}
//             </span>
//           )}
//         </div>

//         {/* CTA Buttons - Dynamic actions */}
//         <div className="flex gap-4">
//           {onBookNow && (
//             <button
//               onClick={onBookNow}
//               className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform"
//             >
//               {ctaLabel}
//             </button>
//           )}
//           {onInquiry && (
//             <button
//               onClick={onInquiry}
//               className="px-8 py-3 rounded-full bg-white/10 backdrop-blur text-white font-bold text-lg shadow-lg hover:bg-white/20 transition-all"
//             >
//               Inquire Now
//             </button>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }



// src/trekkingpage/HeroSection.jsx
/**
 * HeroSection Component
 * 
 * Displays the hero banner with dynamic image from Django backend.
 * Images are uploaded via admin panel and served from media/hero_images/
 * 
 * Props:
 * - imageUrl: Absolute URL from backend API (e.g., http://localhost:8000/media/hero_images/ebc.jpg)
 * - All other props are dynamic text content
 */
import React, { useState, useEffect } from "react";
import { MapPinIcon, CalendarIcon, FireIcon } from "@heroicons/react/24/outline";
import { createImageErrorHandler, getFallbackImage } from "./trekdatahelper";

export default function HeroSection({
  title = "Everest Base Camp Trek",
  subtitle = "Follow in the footsteps of legends through Sherpa villages & Himalayan panoramas.",
  imageUrl,
  imageAlt,
  imageCaption,
  ctaLabel = "Book This Trek",
  season,
  duration,
  difficulty,
  location,
  onBookNow,
  onInquiry,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use provided URL or fallback
  const displayImage = imageUrl || getFallbackImage('hero');
  const fallbackImage = getFallbackImage('hero');

  // Reset state when image URL changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    console.log('✅ Hero image loaded:', displayImage);
  };

  const handleImageError = (e) => {
    console.error('❌ Hero image failed:', displayImage);
    setImageError(true);
    
    // Try fallback if not already using it
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
    } else {
      console.error('❌ Fallback image also failed');
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}

      {/* Background Image */}
      <img
        src={displayImage}
        alt={imageAlt || title}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          imageLoaded ? 'opacity-80' : 'opacity-0'
        }`}
        loading="eager"
        onLoad={handleImageLoad}
        onError={handleImageError}
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

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Trek Info Badges */}
        {(duration || difficulty || location) && (
          <div className="flex flex-wrap justify-center gap-4 text-white mb-6">
            {duration && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm font-medium">
                <CalendarIcon className="h-5 w-5" />
                {duration}
              </span>
            )}
            {difficulty && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm font-medium">
                <FireIcon className="h-5 w-5" />
                {difficulty}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm font-medium">
                <MapPinIcon className="h-5 w-5" />
                {location}
              </span>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onBookNow && (
            <button
              onClick={onBookNow}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              {ctaLabel}
            </button>
          )}
          {onInquiry && (
            <button
              onClick={onInquiry}
              className="px-8 py-3 rounded-full bg-white/10 backdrop-blur text-white font-bold text-lg shadow-lg hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              Inquire Now
            </button>
          )}
        </div>
      </div>

      {/* Image Caption Overlay */}
      {imageCaption && imageLoaded && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded backdrop-blur max-w-xs">
          {imageCaption}
        </div>
      )}

      {/* Error indicator (dev mode only) */}
      {imageError && import.meta.env.DEV && (
        <div className="absolute top-4 right-4 bg-red-500/80 text-white text-xs px-3 py-1 rounded backdrop-blur">
          ⚠️ Image load error
        </div>
      )}
    </section>
  );
}