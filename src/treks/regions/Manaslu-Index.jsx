// src/pages/manaslu/ManasluTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/useTreksByRegion";
import { REGIONS } from "../../api/regionService";

// Highlights for Manaslu treks
const highlights = [
  {
    icon: "/icons/mountains.svg",
    title: "Stunning Himalayan Views",
    desc: "Marvel at Manaslu, Himalchuli, and Ganesh peaks.",
  },
  {
    icon: "/icons/temple.svg",
    title: "Rich Tibetan Culture",
    desc: "Discover ancient monasteries and Tibetan heritage in Tsum Valley.",
  },
  {
    icon: "/icons/forest.svg",
    title: "Unspoiled Nature Trails",
    desc: "Trek through rhododendron forests, himalayan landscapes, and remote villages.",
  },
];

// FAQs for Manaslu treks
const faqs = [
  {
    q: "Do I need permits for Manaslu trekking?",
    a: "Yes, you require a Restricted Area Permit and TIMS card for Manaslu region treks.",
  },
  {
    q: "What is the best time to trek in Manaslu?",
    a: "Spring (March-May) and Autumn (September-November) provide the best weather conditions.",
  },
  {
    q: "Are Manaslu treks suitable for beginners?",
    a: "Manaslu treks are moderate to challenging; prior trekking experience is recommended.",
  },
];

// Testimonials
const testimonials = [
  {
    text: "The Manaslu Circuit was the adventure of a lifetime. Pristine nature and incredible hospitality.",
    name: "James R.",
    date: "Oct 2025",
  },
  {
    text: "Tsum Valley offered an authentic cultural experience unlike anywhere else in Nepal.",
    name: "Priya K.",
    date: "Apr 2025",
  },
];

export default function ManasluTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.MANASLU);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-[65vh]">
        <img
          src="/manasluhero.jpeg"
          alt="Manaslu Trekking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-yellow-900/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg"
          >
            Manaslu Treks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-yellow-200 max-w-2xl drop-shadow"
          >
            Explore remote valleys, Tibetan culture, and breathtaking mountain views.
          </motion.p>
        </div>
      </section>

      {/* Trek Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Explore Our Manaslu Treks
          </h2>
          <p className="text-gray-600 mt-2">
            Discover challenging trails, ancient monasteries, and the world's eighth-highest mountain.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-600">Loading Manaslu treks...</p>
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
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
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
                No Manaslu treks found. Please check back later.
              </p>
              <Link
                to="/contact"
                className="inline-block px-6 py-2.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
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
                region="manaslu"
              />
            ))}
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">
            Why Choose Manaslu?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-200 rounded-xl shadow-lg"
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

      {/* Testimonials Section */}
      <section className="bg-yellow-50 py-16">
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
                className="w-full flex justify-between items-center py-4 text-left text-gray-800 hover:text-yellow-600 transition-colors"
              >
                <span className="font-medium">{f.q}</span>
                <span className="text-2xl text-yellow-600">
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
            Ready to Discover Manaslu?
          </h3>
          <p className="text-gray-600 mb-8">
            Contact our trekking specialists to customize your adventure in the Manaslu region.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-yellow-500 text-white font-medium rounded-full shadow hover:bg-yellow-600 transition"
          >
            Plan My Trek
          </Link>
        </div>
      </section>
    </div>
  );
}
