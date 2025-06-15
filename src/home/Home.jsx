// src/pages/Home.jsx
import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";
import FeaturedTrek from "./FeaturedTreks";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ===== Best Treks Section ===== */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sky-400 uppercase text-sm tracking-wider mb-1">
              Trending Holidays
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Best Treks in Nepal
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* your 3-col Featured Trek grid */}
        <FeaturedTrek />
      </section>

      {/* …other sections like Testimonials, etc. */}

    </>
  );
}
