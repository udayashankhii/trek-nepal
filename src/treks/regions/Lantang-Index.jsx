// src/pages/langtang/LangtangTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/useTreksByRegion";
import { REGIONS } from "../../api/regionService";

// Highlights for Langtang treks
const highlights = [
  {
    icon: "/icons/mountains.svg",
    title: "Spectacular Mountain Views",
    desc: "See Langtang Lirung and Ganesh Himal up close.",
  },
  {
    icon: "/icons/temple.svg",
    title: "Cultural Richness",
    desc: "Experience Tamang culture, traditional villages, and monasteries.",
  },
  {
    icon: "/icons/forest.svg",
    title: "Dense Forest Trails",
    desc: "Trek through rhododendron and oak forests along glacial rivers.",
  },
];

// FAQs for Langtang treks
const faqs = [
  {
    q: "Do I need a special permit for Langtang treks?",
    a: "Yes, a Langtang National Park permit and TIMS card are required for most treks.",
  },
  {
    q: "What is the best season to trek Langtang?",
    a: "Spring (March-May) and Autumn (September-November) offer the best weather and views.",
  },
  {
    q: "Are the Langtang treks suitable for beginners?",
    a: "Most treks are moderate difficulty and suitable for fit beginners with proper acclimatization.",
  },
  {
    q: "How long does the Langtang Valley trek take?",
    a: "The classic Langtang Valley trek typically takes 7-10 days depending on your pace and acclimatization needs.",
  },
];

// Testimonials
const testimonials = [
  {
    text: "Langtang trek was a breathtaking experience, peaceful and beautiful. The Tamang hospitality was exceptional!",
    name: "Maya T.",
    date: "Feb 2025",
  },
  {
    text: "The cultural experience combined with stunning views was unforgettable. Kyanjin Gompa was absolutely magical.",
    name: "Samir P.",
    date: "Nov 2024",
  },
];

export default function LangtangTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.LANGTANG);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-[65vh]">
        <img
          src="/langtanghero.jpeg"
          alt="Langtang Trekking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg"
          >
            Langtang Treks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-green-200 max-w-2xl drop-shadow"
          >
            Explore serene valleys, rich culture, and majestic peaks closest to Kathmandu.
          </motion.p>
        </div>
      </section>

      {/* Trek Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Explore Our Langtang Treks
          </h2>
          <p className="text-gray-600 mt-2">
            Discover pristine valleys, ancient monasteries, and friendly Tamang villages just north of Kathmandu.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Loading Langtang treks...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to load treks
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && treks.length === 0 && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                No Langtang treks found. Please check back later.
              </p>
              <Link
                to="/contact"
                className="inline-block px-6 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                Contact Us for Custom Treks
              </Link>
            </div>
          </div>
        )}

        {/* Trek Grid */}
        {!loading && !error && treks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <TrekCard
                key={trek.slug || trek.id}
                trek={trek}
                region="langtang"
              />
            ))}
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">
            Why Choose Langtang?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-green-50 to-green-200 rounded-xl shadow-lg"
              >
                <img src={h.icon} alt={h.title} className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-medium mb-2 text-gray-900">
                  {h.title}
                </h4>
                <p className="text-gray-600">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Feature: Gosaikunda Lake Highlight */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Sacred Gosaikunda Lake
              </h3>
              <p className="text-gray-700 mb-4">
                Trek to the sacred alpine lake of Gosaikunda (4,380m), revered by both Hindus 
                and Buddhists. During the full moon festival of Janai Purnima, thousands of 
                pilgrims visit this holy site.
              </p>
              <p className="text-gray-700">
                The Langtang-Gosaikunda circuit combines stunning mountain scenery with deep 
                spiritual significance, offering a unique blend of nature and culture.
              </p>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] order-1 md:order-2">
              <img
                src="/gosaikunda.jpg"
                alt="Gosaikunda Lake"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            What Our Trekkers Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-xl shadow"
              >
                <p className="italic text-gray-700 mb-4">"{t.text}"</p>
                <h4 className="font-medium text-gray-900">{t.name}</h4>
                <span className="text-sm text-gray-500">{t.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="border-b">
              <button
                onClick={() => setActiveFAQ(idx === activeFAQ ? null : idx)}
                className="w-full flex justify-between items-center py-4 text-left text-gray-800 hover:text-green-600 transition-colors"
              >
                <span className="font-medium">{f.q}</span>
                <span className="text-2xl text-green-600">
                  {idx === activeFAQ ? "−" : "+"}
                </span>
              </button>
              {idx === activeFAQ && (
                <p className="pb-4 text-gray-600">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to Discover Langtang?
          </h3>
          <p className="text-gray-600 mb-8">
            Contact our trekking specialists to customize your perfect Langtang
            adventure. We're here to help plan your journey!
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-green-500 text-white font-medium rounded-full shadow hover:bg-green-600 transition"
          >
            Plan My Trek
          </Link>
        </div>
      </section>
    </div>
  );
}
