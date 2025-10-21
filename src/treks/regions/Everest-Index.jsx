// src/pages/everest/EverestTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import TrekCard from "../TrekCard";

// Sample data for premium Everest treks
const treks = [
  {
    id: 1,
    image: "/annapurna.jpeg",
    title: "Luxury Everest Base Camp Trek & Heli Return",
    slug: "luxury-everest-base-camp-trek-heli-return", // Add this
    days: 10,
    price: 6999,
    reviews: 38,
    rating: 5,
    badge: "LUXURY",
    location: "Everest Base Camp",
  },
  {
    id: 2,
    image: "/everest.jpeg",
    title: "Gokyo Lakes & Renjo La Pass Premium Trek",
    slug: "gokyo-lakes-renjo-la-pass-premium-trek", // Add this
    days: 14,
    price: 6290,
    reviews: 25,
    rating: 5,
    badge: "PREMIUM",
    location: "Gokyo Valley",
  },
  {
    id: 3,
    image: "/trekkinginnepal.jpg",
    title: "Everest Panorama Luxury Lodge Trek",
    slug: "everest-panorama-luxury-lodge-trek", // Add this
    days: 8,
    price: 5190,
    reviews: 19,
    rating: 4,
    badge: "LUXURY",
    location: "Namche & Tengboche",
  },
  {
    id: 4,
    image: "/abcd.png",
    title: "Everest Base Camp Trek",
    slug: "everest-base-camp-trek", // Add this
    days: 14,
    price: 3999,
    reviews: 52,
    rating: 4,
    badge: "HELI RETURN",
    location: "Everest Base Camp",
  },
];


// Sample highlights
const highlights = [
  {
    icon: "/icons/helicopter.svg",
    title: "Helicopter Transfers",
    desc: "Quick aerial transfers with breathtaking views",
  },
  {
    icon: "/icons/lodge.svg",
    title: "Luxury Lodges",
    desc: "Five-star accommodations on the trail",
  },
  {
    icon: "/icons/sherpa.svg",
    title: "Expert Sherpa Guides",
    desc: "Certified Sherpa guides for safety & culture",
  },
];

// Sample FAQs
const faqs = [
  {
    q: "How is this luxury trek different from a standard trek?",
    a: "We offer premium lodges, gourmet meals, helicopter flights, and small group sizes for comfort.",
  },
  {
    q: "What fitness level is required?",
    a: "Moderate fitness with basic acclimatization days—no extreme mountaineering experience needed.",
  },
  {
    q: "Can I customize the itinerary?",
    a: "Yes, contact us to tailor the trip duration, activities, or add acclimatization days.",
  },
];

export default function EverestTrekIndex() {
  const [search, setSearch] = useState("");
  const [activeFAQ, setActiveFAQ] = useState(null);

  const filtered = treks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-[65vh]">
        <img
          src="/annapurna.jpeg"
          alt="Everest Luxury Trek"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg"
          >
            Everest Trekking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-yellow-200 max-w-2xl drop-shadow"
          >
            Experience the Himalayas in style: luxury lodges, gourmet dining,
            and expert Sherpa guides.
          </motion.p>
        </div>
      </section>

      {/* Search & Trek Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            Explore Our Treks
          </h2>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search treks..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((trek) => (
            <TrekCard
              key={trek.id}
              trek={trek}
              region="everest"
              whileHover={{ scale: 1.02 }} // you can still pass motion props if you wrap TrekCard in motion()
            />
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 rounded-xl shadow-lg"
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

      {/* Embedded Video */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Journey Preview
        </h3>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID?rel=0&autoplay=0"
            title="Everest Luxury Trek Preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            What Our Travelers Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "The experience was beyond our expectations…",
                name: "Alexandra M.",
                date: "Mar 2025",
              },
              {
                text: "Flawless service and breathtaking views…",
                name: "Rajiv S.",
                date: "Apr 2025",
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

      {/* FAQ Section */}
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
              {idx === activeFAQ && <p className="pb-4 text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-gray-600 mb-8">
            Contact our luxury travel specialists for a personalized itinerary
            and quote.
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
