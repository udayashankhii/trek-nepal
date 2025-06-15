// src/treks/trekkingpage/MapSection.jsx
import React from "react";

export default function TrekMap({ mapImage, mapDescription }) {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Everest Base Camp Trek Route Map
      </h2>
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
        <img
          src={"/map.webp"}
          alt="Everest Base Camp Trek Map"
          className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
          style={{ maxHeight: 800 }}
        />
        {mapDescription && (
          <div className="p-6 text-gray-600 text-base bg-gray-50 border-t">
            {mapDescription}
          </div>
        )}
      </div>
    </section>
  );
}
