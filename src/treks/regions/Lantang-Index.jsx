// src/pages/langtang/LangtangTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrekCard from "../TrekCard";

// Sample Langtang treks data
const treks = [
  {
    id: 1,
    image: "/langtang1.jpeg",
    title: "Classic Langtang Valley Trek",
    slug: "langtang-region",
    days: 10,
    price: 1299,
    reviews: 48,
    rating: 5,
    badge: "POPULAR",
    location: "Langtang Valley",
  },
  {
    id: 2,
    image: "/langtang2.jpeg",
    title: "Langtang Gosaikunda Circuit Trek",
    slug: "langtang-gosaikunda-circuit-trek",
    days: 14,
    price: 1499,
    reviews: 35,
    rating: 5,
    badge: "CLASSIC",
    location: "Langtang & Gosaikunda",
  },
  {
    id: 3,
    image: "/langtang3.jpeg",
    title: "Helambu Langtang Cultural Trek",
    slug: "helambu-langtang-cultural-trek",
    days: 12,
    price: 1399,
    reviews: 28,
    rating: 4,
    badge: "CULTURAL",
    location: "Helambu & Langtang",
  },
  {
    id: 4,
    image: "/langtang4.jpeg",
    title: "Langtang Tserko Ri View Trek",
    slug: "langtang-tserko-ri-view-trek",
    days: 11,
    price: 1199,
    reviews: 22,
    rating: 4,
    badge: "SCENIC",
    location: "Langtang Valley",
  },
];

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
];

export default function LangtangTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);

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
            Explore serene valleys, rich culture, and majestic peaks.
          </motion.p>
        </div>
      </section>

      {/* Search & Trek Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map((trek) => (
            <TrekCard
              key={trek.id}
              trek={trek}
              region="langtang"
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* Highlights */}
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

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          FAQs
        </h3>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="border-b">
              <button
                onClick={() => setActiveFAQ(idx === activeFAQ ? null : idx)}
                className="w-full flex justify-between items-center py-4 text-left text-gray-800"
              >
                <span>{f.q}</span>
                <span className="text-2xl">
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

      {/* Testimonials */}
      <section className="bg-green-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            What Our Trekkers Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "Langtang trek was a breathtaking experience, peaceful and beautiful.",
                name: "Maya T.",
                date: "Feb 2025",
              },
              {
                text: "The cultural experience combined with stunning views was unforgettable.",
                name: "Samir P.",
                date: "Nov 2024",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-xl shadow"
              >
                <p className="italic text-gray-700 mb-4">“{t.text}”</p>
                <h4 className="font-medium text-gray-900">{t.name}</h4>
                <span className="text-sm text-gray-500">{t.date}</span>
              </motion.div>
            ))}
          </div>
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
            adventure.
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
