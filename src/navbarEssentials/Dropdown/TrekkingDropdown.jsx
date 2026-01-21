import React from "react";
import Treks from "../Treks";

export default function TrekkingDropdown({ isOpen, onNavigate }) {
  return (
    <div
      className={`absolute left-1/2 -translate-x-[52%] bg-white shadow-2xl border border-gray-200 
                 rounded-xl z-[50] transform-gpu will-change-transform 
                 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
      }`}
      style={{
        width: "min(1280px, calc(100vw - 2rem))",
        maxWidth: "1280px",
        maxHeight: "calc(80vh - 2rem)",
        marginTop: "0.5rem",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div 
        className="p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500"
        style={{
          maxHeight: "calc(80vh - 3rem)",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f7fafc",
        }}
      >
        {/* Increased padding for more right shift */}
        <div className="px-4 sm:px-6 md:px-8">
          <Treks onNavigate={onNavigate} />
        </div>
      </div>
      
      {/* CSS for webkit scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-track-gray-100::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 10px;
          }
          .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 10px;
          }
          .scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
            background: #a0aec0;
          }
        `
      }} />
    </div>
  );
}
