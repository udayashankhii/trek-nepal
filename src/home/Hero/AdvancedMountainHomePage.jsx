

import React from "react";
import InteractiveMountainScene from "./InteractiveMountainScene";
import EnhancedHeroSection from "./Hero.jsx";
import ScrollDrivenSections from "./ScrollDrivenSections";

export default function AdvancedMountainHomePage({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="min-h-screen relative scrollbar scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-slate-900">
      {/* HERO + TOP */}
      <EnhancedHeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Custom Mountain Scene */}
      <InteractiveMountainScene />

      {/* Scroll-Driven Content */}
      <ScrollDrivenSections />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 
                     text-white p-4 rounded-full shadow-lg hover:shadow-xl
                     transform hover:scale-110 transition-all duration-300 animate-pulse"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

      {/* Loading Overlay */}
      <div
        id="loading-overlay"
        className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center hidden"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mb-4"></div>
          <div className="text-white text-lg font-medium">
            Loading your adventure...
          </div>
        </div>
      </div>
    </div>
  );
}
