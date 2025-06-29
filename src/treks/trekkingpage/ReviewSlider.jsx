// src/components/trek/ReviewsSlider.jsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function ReviewsSlider({ reviews }) {
  const [idx, setIdx] = useState(0);
  const len = reviews?.length || 0;
  if (len === 0) return null;

  const prev = () => setIdx(idx === 0 ? len - 1 : idx - 1);
  const next = () => setIdx(idx === len - 1 ? 0 : idx + 1);

  return (
    <section className="relative py-8 bg-gray-50 rounded-2xl">
      {/* Top-right arrows */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={prev}
          className="bg-white border-2 border-orange-400 text-orange-400 rounded-lg p-2 shadow-lg hover:bg-orange-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="bg-white border-2 border-orange-400 text-orange-400 rounded-lg p-2 shadow-lg hover:bg-orange-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {reviews.map((r) => (
            <div key={r.id} className="min-w-full px-4">
              <ReviewCard {...r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
