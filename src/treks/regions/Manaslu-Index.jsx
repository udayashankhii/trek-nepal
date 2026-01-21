// src/pages/manaslu/ManasluTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Mountain, Users, TreePine, Award, Sparkles, Compass } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/useTreksByRegion";
import { REGIONS } from "../../api/regionService";

// Enhanced highlights for Manaslu treks
const highlights = [
  {
    icon: <Mountain className="w-10 h-10 text-amber-700" />,
    title: "Stunning Himalayan Views",
    desc: "Marvel at Manaslu (8,163m), the world's eighth-highest peak, alongside Himalchuli and Ganesh Himal",
  },
  {
    icon: <Users className="w-10 h-10 text-amber-700" />,
    title: "Rich Tibetan Culture",
    desc: "Discover ancient monasteries and authentic Tibetan heritage in the sacred Tsum Valley",
  },
  {
    icon: <TreePine className="w-10 h-10 text-amber-700" />,
    title: "Unspoiled Nature Trails",
    desc: "Trek through pristine rhododendron forests, alpine landscapes, and remote mountain villages",
  },
];

// Enhanced FAQs for Manaslu treks
const faqs = [
  {
    q: "Do I need permits for Manaslu trekking?",
    a: "Yes, Manaslu is a restricted area requiring a Restricted Area Permit (RAP), Manaslu Conservation Area Permit (MCAP), and TIMS card. Our team handles all permit arrangements as part of your package.",
  },
  {
    q: "What is the best time to trek in Manaslu?",
    a: "Spring (March-May) and Autumn (September-November) provide optimal conditions with stable weather, clear mountain views, and comfortable temperatures. Spring offers blooming rhododendrons, while autumn provides crystal-clear visibility.",
  },
  {
    q: "Are Manaslu treks suitable for beginners?",
    a: "Manaslu treks are moderate to challenging and best suited for trekkers with prior high-altitude experience. The Manaslu Circuit crosses Larkya La Pass at 5,160m, requiring good fitness and acclimatization.",
  },
  {
    q: "What makes Tsum Valley special?",
    a: "Tsum Valley is a hidden Himalayan valley with preserved Tibetan Buddhist culture, ancient monasteries, and warm hospitality. It remained isolated until 2008, maintaining authentic traditions and spiritual practices.",
  },
];

// Enhanced testimonials
const testimonials = [
  {
    text: "The Manaslu Circuit was the adventure of a lifetime. Pristine nature, incredible mountain views, and the warmth of local hospitality made this trek extraordinary.",
    name: "James R.",
    location: "London, UK",
    date: "October 2025",
  },
  {
    text: "Tsum Valley offered an authentic cultural experience unlike anywhere else in Nepal. The monasteries, prayer wheels, and Tibetan traditions left me profoundly moved.",
    name: "Priya K.",
    location: "Delhi, India",
    date: "April 2025",
  },
];

export default function ManasluTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.MANASLU);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manaslu.jpg"
            alt="Manaslu Trekking"
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
              Manaslu Region Treks
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Explore remote valleys, authentic Tibetan culture, and the magnificent eighth-highest mountain
            </p>
            <div className="flex gap-4 justify-center items-center">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-sm tracking-widest uppercase text-amber-200">
                UNESCO World Heritage Circuit
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
              Why Choose Manaslu?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A perfect fusion of challenging adventure, cultural immersion, and remote wilderness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
              Explore Our Manaslu Treks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover challenging trails, ancient monasteries, and the world's eighth-highest mountain
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-amber-700 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Loading Manaslu experiences...</p>
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
                  className="px-8 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  No Manaslu treks available at the moment. Check back soon.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-all duration-300 shadow-lg"
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
                  region="manaslu"
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Special Feature: Tsum Valley Highlight - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-4">
                <Compass className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-6">
                The Sacred Tsum Valley
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Journey into the "Hidden Valley of Happiness," where ancient Tibetan Buddhist culture 
                thrives in pristine isolation. Tsum Valley remained closed to outsiders until 2008, 
                preserving centuries-old monasteries, prayer wheels, and spiritual traditions.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Experience the warmth of Tsumba people, witness ancient rituals at Mu Gompa, and trek 
                through landscapes adorned with mani walls and chortens. This sacred valley offers 
                one of the most authentic cultural experiences in the Himalayas.
              </p>
              <Link
                to="/contact"
                className="inline-block mt-8 px-8 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-all duration-300 shadow-lg"
              >
                Explore Tsum Valley
              </Link>
            </div>
            <div className="relative h-96 md:h-full min-h-[400px] order-1 md:order-2">
              <img
                src="/tsum-valley.jpg"
                alt="Sacred Tsum Valley"
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
            <p className="text-lg text-slate-600">Stories from the Manaslu trails</p>
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
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-lg italic text-slate-700 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.location}</p>
                  <span className="text-sm text-amber-700 mt-1 block">{t.date}</span>
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
            <p className="text-lg text-slate-600">Essential information for your Manaslu journey</p>
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
                  <span className="text-3xl text-amber-700 flex-shrink-0">
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
      <section className="py-24 bg-gradient-to-br from-amber-900 to-amber-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Ready to Discover Manaslu?
          </h3>
          <p className="text-xl text-amber-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our trekking specialists are ready to customize your Manaslu adventure. 
            Explore remote valleys and immerse yourself in authentic Himalayan culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-white text-amber-900 font-medium rounded-full shadow-xl hover:bg-amber-50 transition-all duration-300 hover:scale-105"
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
