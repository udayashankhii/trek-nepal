// src/treks/trekkingpage/TrekAction.jsx
import React from "react";
import { Sliders } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../api/auth/auth.api.js";

export default function TrekActions({
  trekId,
  trekSlug,
  trekName,
  pdfUrl,
  mapImage,
  preferredDates = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCustomize = () => {
    const slug = trekSlug || trekId;

    if (!slug) {
      console.error("❌ No trek slug provided to TrekActions");
      alert("Trek information is not available. Please select a trek first.");
      return;
    }

    // ✅ Check if user is authenticated
    const isAuthenticated = !!getAccessToken();
    
    // Build the customize trek URL
    const customizeUrl = `/customize-trek?trek_id=${slug}`;
    
    // Prepare state data for customize trek page
    const customizeState = {
      trekId: slug,
      tripName: trekName || "",
      preferredDates: preferredDates.slice(0, 3),
    };

    if (isAuthenticated) {
      // ✅ User is logged in - navigate directly to customize trek
      console.log("✅ User authenticated, navigating to customize trek:", slug);
      navigate(customizeUrl, { state: customizeState });
    } else {
      // ❌ User not logged in - show login modal overlay
      console.log("🔒 User not authenticated, showing login modal");
      navigate("/login", {
        state: {
          backgroundLocation: location, // ✅ Current page stays in background
          next: customizeUrl,           // ✅ Where to go after login
          customizeState: customizeState // ✅ Pass trek info through login
        }
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-4 my-8 px-4">
        {/* Customize Trek Button */}
        <button
          onClick={handleCustomize}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sliders size={20} />
          <span>Customize This Trek</span>
        </button>
      </div>
    </div>
  );
}