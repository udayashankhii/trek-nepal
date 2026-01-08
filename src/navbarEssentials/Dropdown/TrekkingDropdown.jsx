



import React from "react";
import Treks from "../Treks";

export default function TrekkingDropdown({ isOpen, onNavigate }) {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-200 rounded-lg z-50 
      transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      }`}
      style={{
        width: "min(1280px, 95vw)",
        maxHeight: "80vh",
        marginTop: "0.5rem",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div 
        className="p-6 overflow-y-auto"
        style={{
          maxHeight: "calc(80vh - 1rem)",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f7fafc",
        }}
      >
        <Treks onNavigate={onNavigate} />
      </div>
    </div>
  );
}
