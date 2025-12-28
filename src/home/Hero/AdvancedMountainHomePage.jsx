

import React from "react";
import InteractiveMountainScene from "./InteractiveMountainScene";
import EnhancedHeroSection from "./Hero.jsx";
import ScrollDrivenSections from "./ScrollDrivenSections";

export default function MountainHomePage({
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
