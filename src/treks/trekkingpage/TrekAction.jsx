// src/treks/trekkingpage/TrekAction.jsx
import React from "react";
import { Download, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrekActions({
  trekId,
  trekSlug,
  trekName,
  pdfUrl,
  preferredDates = [],
}) {
  const navigate = useNavigate();

  const handleCustomize = () => {
    const slug = trekSlug || trekId;
    
    if (!slug) {
      console.error("❌ No trek slug provided to TrekActions");
      alert("Trek information is not available. Please select a trek first.");
      return;
    }
    
    console.log("✅ Customizing trek:", slug);
    
    // ✅ FIX: Use /customize-trek (not /customize-trip) to match your route
    navigate(`/customize-trek?trek_id=${slug}`, {
      state: {
        trekId: slug,
        tripName: trekName || "",
        preferredDates: preferredDates.slice(0, 3)
      }
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 my-8 px-4">
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Download size={20} />
          <span>Download PDF</span>
        </a>
      )}

      <button
        onClick={handleCustomize}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Sliders size={20} />
        <span>Customize This Trek</span>
      </button>
    </div>
  );
}
