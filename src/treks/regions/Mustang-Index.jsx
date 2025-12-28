// src/pages/mustang/MustangTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrekCard from "../TrekCard";

// Sample data for Mustang treks
const treks = [
  {
    id: 1,
    image: "/mustang1.jpeg",
    title: "Upper Mustang Cultural Trek",
    slug: "upper-mustang-cultural-trek",
    days: 14,
    price: 2999,
    reviews: 38,
    rating: 5,
    badge: "CULTURAL",
    location: "Upper Mustang",
  },
  {
    id: 2,
    image: "/mustang2.jpeg",
    title: "Lo Manthang and Mustang Royal Trek",
    slug: "lo-manthang-mustang-royal-trek",
    days: 16,
    price: 3199,
    reviews: 26,
    rating: 5,
    badge: "ROYAL",
    location: "Lo Manthang",
  },
  {
    id: 3,
    image: "/mustang3.jpeg",
    title: "Mustang Tiji Festival Trek",
    slug: "mustang-tiji-festival-trek",
    days: 12,
    price: 2799,
    reviews: 22,
    rating: 4,
    badge: "FESTIVAL",
    location: "Mustang Region",
  },
  {
    id: 4,
    image: "/mustang4.jpeg",
    title: "Mustang Beauty and Mystery Trek",
    slug: "mustang-beauty-mystery-trek",
    days: 15,
    price: 2899,
    reviews: 18,
    rating: 4,
    badge: "SCENIC",
    location: "Mustang Valley",
  },
];

// Highlights for Mustang treks
const highlights = [
  {
    icon: "/icons/mountains.svg",
    title: "Breathtaking Desert Landscapes",
    desc: "Explore the unique barren beauty of Mustang's rain shadow desert.",
  },
  {
    icon: "/icons/temple.svg",
    title: "Tibetan Buddhist Culture",
    desc: "Visit ancient monasteries and experience distinctive Tibetan traditions.",
  },
  {
    icon: "/icons/forest.svg",
    title: "Remote and Untouched Trails",
    desc: "Trek through rarely traveled paths offering mystery and tranquility.",
  },
];

// FAQs for Mustang treks
const faqs = [
  {
    q: "Do I need special permits to trek in Mustang?",
    a: "Yes, a Restricted Area Permit with additional fees is mandatory for Mustang treks.",
  },
  {
    q: "When is the best season for Mustang trekking?",
    a: "Spring (March-May) and Autumn (September-November) are ideal for clear skies and moderate weather.",
  },
  {
    q: "Are Mustang treks suitable for beginners?",
    a: "Mustang treks vary from moderate to challenging; prior experience is recommended for remote areas.",
  },
];

export default function MustangTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-[65vh]">
        <img
          src="/mustanghero.jpeg"
          alt="Mustang Trekking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-900/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg"
          >
            Mustang Treks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-red-200 max-w-2xl drop-shadow"
          >
            Discover ancient Tibetan culture, desert landscapes, and mystical monasteries.
          </motion.p>
        </div>
      </section>

      {/* Trek Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          Explore Our Treks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map((trek) => (
            <TrekCard
              key={trek.id}
              trek={trek}
              region="mustang"
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">
            Why Choose Mustang?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-red-50 to-red-200 rounded-xl shadow-lg"
              >
                <img src={h.icon} alt={h.title} className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-medium mb-2 text-gray-900">{h.title}</h4>
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
                <span className="text-2xl">{idx === activeFAQ ? "−" : "+"}</span>
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
            Ready to Discover Mustang?
          </h3>
          <p className="text-gray-600 mb-8">
            Contact our trekking specialists to customize your Mustang adventure.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-red-500 text-white font-medium rounded-full shadow hover:bg-red-600 transition"
          >
            Plan My Trek
          </Link>
        </div>
      </section>
    </div>
  );
}
