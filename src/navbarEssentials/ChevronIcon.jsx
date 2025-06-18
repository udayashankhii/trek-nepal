import React from "react";

export default function ChevronIcon({ isOpen }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  );
}
