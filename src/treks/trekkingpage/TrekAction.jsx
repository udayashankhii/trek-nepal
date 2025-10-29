// src/treks/trekkingpage/TrekAction.jsx
import React from "react";
import { Download, Edit3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrekActions({
  trekId,
  pdfUrl,
  onViewMap, // new prop
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-8 px-4">
      {/* Download PDF */}
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-full shadow-lg transition"
      >
        <Download size={18} />
        <span>Download PDF</span>
      </a>

      {/* Customize Trip */}
      <Link
        to={`/customize-trek?trek_id=${trekId}`}
        className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-full shadow-lg transition"
      >
        <Edit3 size={18} />
        <span>Customize Trip</span>
      </Link>

      {/* View Trip Map */}
      <button
        onClick={onViewMap}
        className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-full shadow-lg transition"
      >
        <MapPin size={18} />
        <span>View Trip Map</span>
      </button>
    </div>
  );
}
