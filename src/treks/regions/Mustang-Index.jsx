// src/pages/mustang/MustangTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Wind, Landmark, MapPin, Award, Sparkles, Castle } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/service/useTreksByRegion";
import { REGIONS } from "../../api/service/regionService";

// Enhanced highlights for Mustang treks
const highlights = [
  {
    icon: <Wind className="w-10 h-10 text-rose-700" />,
    title: "Breathtaking Desert Landscapes",
    desc: "Explore the unique barren beauty of Mustang's rain shadow desert with dramatic rock formations",
  },
  {
    icon: <Landmark className="w-10 h-10 text-rose-700" />,
    title: "Tibetan Buddhist Culture",
    desc: "Visit ancient monasteries, royal palaces, and experience distinctive Tibetan traditions",
  },
  {
    icon: <MapPin className="w-10 h-10 text-rose-700" />,
    title: "Remote and Untouched Trails",
    desc: "Trek through rarely traveled paths offering mystery, tranquility, and timeless landscapes",
  },
];

// Enhanced FAQs for Mustang treks
const faqs = [
  {
    q: "Do I need special permits to trek in Mustang?",
    a: "Yes, Upper Mustang is a restricted area requiring a special permit costing $500 USD for 10 days, plus $50 per additional day. Lower Mustang requires only TIMS and Annapurna Conservation Area permits. Our team arranges all documentation.",
  },
  {
    q: "When is the best season for Mustang trekking?",
    a: "Spring (March-May) and Autumn (September-November) are ideal for comfortable temperatures and clear skies. Mustang can also be trekked during summer monsoon as it lies in the rain shadow, receiving minimal rainfall.",
  },
  {
    q: "Are Mustang treks suitable for beginners?",
    a: "Mustang treks vary from moderate to challenging. Lower Mustang (Jomsom-Muktinath) is suitable for beginners, while Upper Mustang requires moderate fitness and acclimatization due to high altitudes (3,800m+) and remote conditions.",
  },
  {
    q: "What makes Upper Mustang unique?",
    a: "Upper Mustang is a former Buddhist kingdom that remained closed to outsiders until 1992. It preserves ancient Tibetan culture, features the walled city of Lo Manthang, cave dwellings from 3,000 years ago, and offers unparalleled cultural authenticity.",
  },
];

// Enhanced testimonials
const testimonials = [
  {
    text: "Upper Mustang felt like stepping into a time capsule. The dramatic landscapes, ancient monasteries, and warm hospitality created an otherworldly experience I'll never forget.",
    name: "Sophie L.",
    location: "Paris, France",
    date: "May 2025",
  },
  {
    text: "Experiencing the Tiji Festival trek was magical—witnessing centuries-old Buddhist rituals in Lo Manthang was a perfect blend of adventure and cultural immersion.",
    name: "Tenzin W.",
    location: "Singapore",
    date: "March 2025",
  },
];

export default function MustangTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.MUSTANG);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/mustang.jpg"
            alt="Mustang Trekking"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/70" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-serif font-light text-white leading-tight drop-shadow-2xl mb-6 tracking-wide">
              Mustang Kingdom Treks
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Discover ancient Tibetan culture, dramatic desert landscapes, and mystical monasteries in the last forbidden kingdom
            </p>
            <div className="flex gap-4 justify-center items-center">
              <Award className="w-6 h-6 text-rose-400" />
              <span className="text-sm tracking-widest uppercase text-rose-200">
                The Last Forbidden Kingdom
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section - Before Treks */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Why Choose Mustang?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A mesmerizing journey through time, culture, and extraordinary desert landscapes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center p-8 bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  {h.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">
                  {h.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trek Cards Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Explore Our Mustang Treks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Journey through the forbidden kingdom of Lo and experience timeless Tibetan Buddhist culture
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-rose-700 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Loading Mustang experiences...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Unable to load treks
                </h3>
                <p className="text-slate-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-rose-700 text-white rounded-full hover:bg-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && treks.length === 0 && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <p className="text-slate-600 text-lg mb-6">
                  No Mustang treks available at the moment. Check back soon.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-rose-700 text-white rounded-full hover:bg-rose-800 transition-all duration-300 shadow-lg"
                >
                  Request Custom Trek
                </Link>
              </div>
            </div>
          )}

          {/* Trek Grid */}
          {!loading && !error && treks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {treks.map((trek) => (
                <TrekCard
                  key={trek.slug || trek.id}
                  trek={trek}
                  region="mustang"
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Special Feature: Lo Manthang Highlight - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-4">
                <Castle className="w-10 h-10 text-rose-700" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-6">
                The Walled City of Lo Manthang
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Step into the former Buddhist kingdom of Lo, a medieval walled city preserved in time 
                for over 600 years. Explore the royal palace, four major monasteries dating to the 15th 
                century, and witness traditional Tibetan Buddhist rituals unchanged by modernity.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Upper Mustang remained completely closed to outsiders until 1992, creating one of the 
                world's most preserved repositories of Tibetan culture. The dramatic landscapes, ancient 
                cave dwellings, and warm hospitality of the Lo people create an unforgettable journey.
              </p>
              <Link
                to="/contact"
                className="inline-block mt-8 px-8 py-3 bg-rose-700 text-white rounded-full hover:bg-rose-800 transition-all duration-300 shadow-lg"
              >
                Explore Lo Manthang
              </Link>
            </div>
            <div className="relative h-96 md:h-full min-h-[400px] order-1 md:order-2">
              <img
                src="/lo-mothang.jpg"
                alt="Walled City of Lo Manthang"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Trekker Experiences
            </h3>
            <p className="text-lg text-slate-600">Stories from the forbidden kingdom</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200"
              >
                <div className="mb-6">
                  <Sparkles className="w-8 h-8 text-rose-600" />
                </div>
                <p className="text-lg italic text-slate-700 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.location}</p>
                  <span className="text-sm text-rose-700 mt-1 block">{t.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-slate-600">Essential information for your Mustang journey</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(idx === activeFAQ ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-lg pr-4">{f.q}</span>
                  <span className="text-3xl text-rose-700 flex-shrink-0">
                    {idx === activeFAQ ? "−" : "+"}
                  </span>
                </button>
                {idx === activeFAQ && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry CTA - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-rose-900 to-rose-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Ready to Discover Mustang?
          </h3>
          <p className="text-xl text-rose-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our trekking specialists are ready to customize your Mustang adventure. 
            Explore the last forbidden kingdom and step back in time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-white text-rose-900 font-medium rounded-full shadow-xl hover:bg-rose-50 transition-all duration-300 hover:scale-105"
            >
              Plan My Trek
            </Link>
            <Link
              to="/treks"
              className="inline-block px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              View All Regions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
