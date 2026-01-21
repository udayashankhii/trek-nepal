// src/pages/langtang/LangtangTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Mountain, Users, TreePine, Award, Sparkles } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/useTreksByRegion";
import { REGIONS } from "../../api/regionService";

// Enhanced highlights for Langtang treks
const highlights = [
  {
    icon: <Mountain className="w-10 h-10 text-emerald-600" />,
    title: "Spectacular Mountain Views",
    desc: "Witness Langtang Lirung and Ganesh Himal in their pristine majesty",
  },
  {
    icon: <Users className="w-10 h-10 text-emerald-600" />,
    title: "Cultural Richness",
    desc: "Immerse yourself in authentic Tamang culture, traditional villages, and ancient monasteries",
  },
  {
    icon: <TreePine className="w-10 h-10 text-emerald-600" />,
    title: "Dense Forest Trails",
    desc: "Trek through enchanting rhododendron and oak forests along glacial rivers",
  },
];

// FAQs for Langtang treks
const faqs = [
  {
    q: "Do I need a special permit for Langtang treks?",
    a: "Yes, a Langtang National Park permit and TIMS card are required for most treks. Our team handles all permit arrangements as part of your package.",
  },
  {
    q: "What is the best season to trek Langtang?",
    a: "Spring (March-May) and Autumn (September-November) offer optimal weather with clear mountain views, moderate temperatures, and blooming rhododendrons in spring.",
  },
  {
    q: "Are the Langtang treks suitable for beginners?",
    a: "Most Langtang treks are moderate difficulty and suitable for fit beginners with proper acclimatization. We recommend cardiovascular preparation for 2-3 months before departure.",
  },
  {
    q: "How long does the Langtang Valley trek take?",
    a: "The classic Langtang Valley trek typically takes 7-10 days depending on your pace and acclimatization needs. We can customize the itinerary to match your schedule.",
  },
];

// Testimonials
const testimonials = [
  {
    text: "Langtang exceeded all expectations. The pristine beauty, warm Tamang hospitality, and our expert guide made this an unforgettable journey.",
    name: "Maya T.",
    location: "Sydney, Australia",
    date: "February 2025",
  },
  {
    text: "The cultural immersion combined with breathtaking landscapes was extraordinary. Kyanjin Gompa at sunrise remains etched in my memory forever.",
    name: "Samir P.",
    location: "Mumbai, India",
    date: "November 2024",
  },
];

export default function LangtangTrek() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.LANGTANG);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Enhanced with Parallax Effect */}
      <section className="relative h-[100vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/langtang.jpg"
            alt="Langtang Trekking"
            className="w-full h-150 object-cover scale-110"
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
              Langtang Valley Treks
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Explore serene valleys, rich Tamang culture, and majestic peaks closest to Kathmandu
            </p>
            <div className="flex gap-4 justify-center items-center">
              <Award className="w-6 h-6 text-emerald-400" />
              <span className="text-sm tracking-widest uppercase text-emerald-200">
                Closest Himalayan Region to Kathmandu
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
              Why Choose Langtang?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A perfect blend of natural beauty, cultural authenticity, and accessibility
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center p-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
              Explore Our Langtang Treks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover pristine valleys, ancient monasteries, and welcoming Tamang villages just north of Kathmandu
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Loading Langtang experiences...</p>
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
                  className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  No Langtang treks available at the moment. Check back soon.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg"
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
                  region="langtang"
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Special Feature: Gosaikunda Lake Highlight - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-4">
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-6">
                Sacred Gosaikunda Lake
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Journey to the sacred alpine lake of Gosaikunda (4,380m), revered by both Hindus 
                and Buddhists as one of Nepal's most holy sites. During the full moon festival of 
                Janai Purnima, thousands of pilgrims make this spiritual pilgrimage.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                The Langtang-Gosaikunda circuit seamlessly combines stunning mountain panoramas with 
                profound spiritual significance, offering a unique blend of natural wonder and cultural depth.
              </p>
              <Link
                to="/contact"
                className="inline-block mt-8 px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg"
              >
                Plan Gosaikunda Trek
              </Link>
            </div>
            <div className="relative h-96 md:h-full min-h-[400px] order-1 md:order-2">
              <img
                src="/gosainkunda.jpg"
                alt="Sacred Gosaikunda Lake"
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
            <p className="text-lg text-slate-600">Stories from the Langtang trails</p>
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
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-lg italic text-slate-700 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.location}</p>
                  <span className="text-sm text-emerald-600 mt-1 block">{t.date}</span>
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
            <p className="text-lg text-slate-600">Essential information for your Langtang journey</p>
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
                  <span className="text-3xl text-emerald-600 flex-shrink-0">
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
      <section className="py-24 bg-gradient-to-br from-emerald-800 to-emerald-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Ready to Discover Langtang?
          </h3>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our trekking specialists are ready to customize your perfect Langtang adventure. 
            Let us help you create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-white text-emerald-900 font-medium rounded-full shadow-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
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
