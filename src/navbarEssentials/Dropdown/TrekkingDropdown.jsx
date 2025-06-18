import React from "react";
import Treks from "../Treks";

export default function TrekkingDropdown({ isOpen }) {
  return (
    <div
      className={`absolute left-1 bg-white shadow-xl border border-gray-200 rounded-lg z-50 
      transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
      }`}
      style={{
        width: "min(100vw, 1320px)",
        maxHeight: "100vh",
        overflowY: "auto",
        transform: "translateX(-40%)",
        marginTop: "0.5rem",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        className="p-6 overflow-y-auto"
        style={{
          maxHeight: "60vh",
          scrollbarWidth: "thin",
        }}
      >
        <Treks />
      </div>
    </div>
  );
}
