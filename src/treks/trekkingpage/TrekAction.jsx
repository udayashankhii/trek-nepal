// src/treks/trekkingpage/TrekAction.jsx
import React, { useState } from "react";
import { Download, Sliders, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrekActions({
  trekId,
  trekSlug,
  trekName,
  pdfUrl,
  mapImage,
  preferredDates = [],
}) {
  const navigate = useNavigate();
  const [downloadStatus, setDownloadStatus] = useState(null); // 'success', 'error', null

  const handleCustomize = () => {
    const slug = trekSlug || trekId;

    if (!slug) {
      console.error("❌ No trek slug provided to TrekActions");
      alert("Trek information is not available. Please select a trek first.");
      return;
    }

    console.log("✅ Customizing trek:", slug);

    navigate(`/customize-trek?trek_id=${slug}`, {
      state: {
        trekId: slug,
        tripName: trekName || "",
        preferredDates: preferredDates.slice(0, 3),
      },
    });
  };

  const handleDownloadPDF = async () => {
    if (!pdfUrl) {
      console.warn("⚠️ No PDF URL available");
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus(null), 3000);
      return;
    }

    try {
      console.log("✅ Downloading PDF from:", pdfUrl);
      
      // Method 1: Open in new tab (browser handles download)
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      
      // Extract filename from URL
      const urlParts = pdfUrl.split("/");
      const filename = urlParts[urlParts.length - 1] || `${trekSlug || 'trek'}-itinerary.pdf`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-4 my-8 px-4">
        {/* PDF Download Button */}
        {pdfUrl ? (
          <button
            onClick={handleDownloadPDF}
            disabled={!pdfUrl}
            className={`flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              downloadStatus === "success" ? "ring-2 ring-green-500" : ""
            } ${downloadStatus === "error" ? "ring-2 ring-red-500" : ""}`}
          >
            <Download size={20} />
            <span>Download PDF</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl cursor-not-allowed">
            <Download size={20} />
            <span>PDF Not Available</span>
          </div>
        )}

        {/* Customize Trek Button */}
        <button
          onClick={handleCustomize}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sliders size={20} />
          <span>Customize This Trek</span>
        </button>
      </div>

      {/* Download Status Notification */}
      {downloadStatus && (
        <div
          className={`fixed bottom-20 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl animate-slide-up ${
            downloadStatus === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {downloadStatus === "success" ? (
            <>
              <CheckCircle size={20} />
              <span className="font-medium">PDF download started!</span>
            </>
          ) : (
            <>
              <XCircle size={20} />
              <span className="font-medium">PDF not available</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
