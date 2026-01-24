// src/pages/everest/EverestTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Mountain, Sparkles, Award, FlagTriangleRight, Users, Heart } from "lucide-react";
import { FaHelicopter } from "react-icons/fa";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/service/useTreksByRegion";
import { REGIONS } from "../../api/service/regionService";

// Enhanced highlights for Everest treks
const highlights = [
  {
    icon: <Mountain className="w-10 h-10 text-sky-700" />,
    title: "World's Highest Peak",
    desc: "Stand at the base of Mount Everest (8,848m) and witness the legendary Khumbu Icefall",
  },
  {
    icon: <FaHelicopter className="w-10 h-10 text-sky-700" />,
    title: "Helicopter Transfers",
    desc: "Luxury helicopter flights to and from Lukla with breathtaking aerial views of the Himalayas",
  },
  {
    icon: <Users className="w-10 h-10 text-sky-700" />,
    title: "Expert Sherpa Guides",
    desc: "Certified Sherpa guides with generations of Himalayan expertise ensuring safety and cultural insights",
  },
];

// Enhanced FAQs for Everest treks
const faqs = [
  {
    q: "How is the luxury Everest trek different from standard treks?",
    a: "Our luxury Everest treks feature premium lodges with heated rooms and en-suite bathrooms, gourmet meals prepared by expert chefs, helicopter transfers to/from Lukla, smaller group sizes (maximum 6-8 people), and enhanced support with higher guide-to-trekker ratios for personalized attention.",
  },
  {
    q: "What fitness level is required for Everest Base Camp?",
    a: "Moderate to good fitness is required. While luxury services enhance comfort, the trek still involves 5-7 hours of daily walking at high altitude (up to 5,545m at Kala Patthar). We recommend cardiovascular training for 2-3 months before departure, including hiking with a backpack.",
  },
  {
    q: "Can I customize the itinerary?",
    a: "Absolutely. We can tailor the duration, add extra acclimatization days, include side trips to Gokyo Lakes or Island Peak, arrange private guides, or combine with helicopter tours. Contact us to design your perfect Everest experience.",
  },
  {
    q: "What makes the Sherpa culture special?",
    a: "The Sherpa people are legendary mountaineers with deep Tibetan Buddhist traditions. You'll visit ancient monasteries like Tengboche, experience warm Sherpa hospitality, witness traditional festivals, and learn about their remarkable mountaineering legacy dating back to the first Everest summit in 1953.",
  },
];

// Enhanced testimonials
const testimonials = [
  {
    text: "Standing at Everest Base Camp was a dream fulfilled. The luxury lodges made the challenging trek comfortable, and our Sherpa guide's knowledge enriched every moment. An experience beyond words.",
    name: "Michael Chen",
    location: "San Francisco, USA",
    date: "November 2025",
  },
  {
    text: "The helicopter flight from Lukla combined with the trek created the perfect balance of adventure and comfort. The views from Kala Patthar at sunrise were absolutely magical.",
    name: "Elena Rodriguez",
    location: "Barcelona, Spain",
    date: "October 2025",
  },
];

export default function EverestTrekIndex() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.EVEREST);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/everest.jpg"
            alt="Everest Luxury Trek"
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
              Everest Region Treks
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Experience the Himalayas in style—luxury lodges, gourmet dining, helicopter transfers, and expert Sherpa guides
            </p>
            <div className="flex gap-4 justify-center items-center">
              <Award className="w-6 h-6 text-sky-400" />
              <span className="text-sm tracking-widest uppercase text-sky-200">
                Home of the World's Highest Peak
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
              Why Choose Everest?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The ultimate Himalayan adventure combining legendary peaks, rich Sherpa culture, and unparalleled luxury
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center p-8 bg-gradient-to-br from-sky-50 to-white rounded-2xl border border-sky-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
              Explore Our Everest Treks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From classic base camp journeys to three high passes adventures—discover the Khumbu region in ultimate comfort
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-sky-700 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Loading Everest experiences...</p>
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
                  className="px-8 py-3 bg-sky-700 text-white rounded-full hover:bg-sky-800 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  No Everest treks available at the moment. Check back soon.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-sky-700 text-white rounded-full hover:bg-sky-800 transition-all duration-300 shadow-lg"
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
                  region="everest"
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Special Feature: Kala Patthar & Sherpa Culture - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-4">
                <FlagTriangleRight className="w-10 h-10 text-sky-700" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-6">
                Kala Patthar & Sherpa Heritage
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Climb to Kala Patthar (5,545m), the ultimate viewpoint offering panoramic vistas of Mount 
                Everest, Lhotse, Nuptse, and the Khumbu Icefall bathed in golden sunrise light [web:25]. 
                This iconic vantage point provides closer views of Everest than the base camp itself.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Immerse yourself in legendary Sherpa culture as you trek through Namche Bazaar, visit the 
                ancient Tengboche Monastery, and learn from guides whose families have been Himalayan 
                mountaineers for generations [web:26]. The Sherpas' spiritual connection to these mountains 
                and their unmatched expertise make them guardians of the Himalayas [web:26].
              </p>
              <Link
                to="/contact"
                className="inline-block mt-8 px-8 py-3 bg-sky-700 text-white rounded-full hover:bg-sky-800 transition-all duration-300 shadow-lg"
              >
                Plan Kala Patthar Trek
              </Link>
            </div>
            <div className="relative h-96 md:h-full min-h-[400px] order-1 md:order-2">
              <img
                src="/kala-patthar.jpg"
                alt="Kala Patthar Viewpoint and Everest"
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
            <p className="text-lg text-slate-600">Stories from the roof of the world</p>
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
                  <Sparkles className="w-8 h-8 text-sky-600" />
                </div>
                <p className="text-lg italic text-slate-700 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.location}</p>
                  <span className="text-sm text-sky-700 mt-1 block">{t.date}</span>
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
            <p className="text-lg text-slate-600">Essential information for your Everest journey</p>
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
                  <span className="text-3xl text-sky-700 flex-shrink-0">
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

      {/* Luxury Features Section - Unique to Everest */}
      <section className="py-24 bg-gradient-to-br from-sky-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              The Luxury Difference
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience Everest with uncompromising comfort and style
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-sky-700" />,
                title: "Premium Lodges",
                desc: "Stay at the finest lodges in the Khumbu with heated rooms, en-suite bathrooms, and mountain views",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-sky-700" />,
                title: "Gourmet Dining",
                desc: "Enjoy international and local cuisine prepared by expert chefs with fresh ingredients",
              },
              {
                icon: <FaHelicopter className="w-8 h-8 text-sky-700" />,
                title: "VIP Transfers",
                desc: "Skip the long flights with private helicopter transfers to and from Lukla",
              },
              {
                icon: <Users className="w-8 h-8 text-sky-700" />,
                title: "Small Groups",
                desc: "Maximum 6-8 trekkers per group ensuring personalized attention and flexibility",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-900">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry CTA - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-sky-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Ready to Conquer Everest?
          </h3>
          <p className="text-xl text-sky-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our luxury travel specialists are ready to craft your personalized Everest expedition. 
            Stand at the base of the world's highest peak in ultimate comfort and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-white text-sky-900 font-medium rounded-full shadow-xl hover:bg-sky-50 transition-all duration-300 hover:scale-105"
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
