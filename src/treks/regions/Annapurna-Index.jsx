// src/pages/treks/AnnapurnaLuxuryPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, UserCheck, Thermometer, Loader2, AlertCircle, Award } from "lucide-react";
import { FaHelicopter } from "react-icons/fa";
import { motion } from "framer-motion";
import TrekCard from "../TrekCard";
import ExperienceSelector from "../../components/ExperienceSelector";
import { useTreksByRegion } from "../../api/service/useTreksByRegion";
import { REGIONS } from "../../api/service/regionService";

const AnnapurnaLuxuryPage = () => {
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.ANNAPURNA);

  // Filter logic based on experience type
  const filteredTreks = treks.filter((t) => {
    if (selectedExperience === "all") return true;
    
    const highlights = t.highlights || [];
    const highlightsText = highlights.join(" ").toLowerCase();
    
    if (selectedExperience === "heli") {
      return highlightsText.includes("heli") || highlightsText.includes("helicopter");
    }
    if (selectedExperience === "wellness") {
      return highlightsText.includes("spa") || highlightsText.includes("massage") || highlightsText.includes("wellness");
    }
    if (selectedExperience === "cultural") {
      return highlightsText.includes("cultural") || highlightsText.includes("guide");
    }
    return true;
  });

  const testimonials = [
    {
      text: "An absolutely transformative journey. The luxury lodges exceeded expectations, and the personalized attention made this trek unforgettable.",
      name: "Catherine R.",
      location: "London, UK",
      date: "December 2025",
    },
    {
      text: "The helicopter transfer was spectacular, and having a dedicated guide enhanced every moment. This is trekking at its finest.",
      name: "David M.",
      location: "New York, USA",
      date: "October 2025",
    },
  ];

  const faqs = [
    {
      q: "What makes the Annapurna luxury experience unique?",
      a: "Our luxury expeditions combine premium accommodations with personalized service, including climate-controlled lodges, spa facilities, private helicopter transfers, and 1:1 guide ratios for an unparalleled Himalayan experience.",
    },
    {
      q: "Are helicopter transfers included in all packages?",
      a: "Helicopter transfers are available on select luxury packages. Each trek listing specifies what's included, and we can customize any itinerary to add VIP transfer options.",
    },
    {
      q: "What level of fitness is required for luxury treks?",
      a: "While our luxury services enhance comfort, Annapurna treks still require good physical fitness. We recommend regular cardio exercise for 2-3 months before departure.",
    },
    {
      q: "Can dietary preferences be accommodated?",
      a: "Absolutely. Our luxury lodges offer gourmet dining with international and local cuisine, accommodating all dietary requirements including vegan, vegetarian, and allergen-free options.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/annapurna.jpg"
            alt="Annapurna Luxury Trekking"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/70" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-serif font-light mb-6 tracking-wide leading-tight">
              Annapurna Luxury Expeditions
            </h1>
            <p className="text-xl md:text-2xl font-light text-slate-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience the Annapurna range with unparalleled comfort—luxury lodges, private helicopter transfers, and bespoke Himalayan journeys
            </p>
            <div className="flex gap-4 justify-center">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-sm tracking-widest uppercase text-amber-200">Award-Winning Service</span>
            </div>
          </motion.div>
        </div>
      </section>



      {/* USP Grid - Refined */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              The Luxury Difference
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every detail curated for discerning travelers seeking extraordinary Himalayan experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Thermometer className="w-10 h-10 mx-auto text-amber-600 mb-6" />,
                title: "Climate-Controlled Lodges",
                desc: "Heated rooms with oxygen enrichment systems ensuring comfort at altitude",
              },
              {
                icon: <Sparkles className="w-10 h-10 mx-auto text-amber-600 mb-6" />,
                title: "Spa & Wellness",
                desc: "Daily massage therapy, hot stone baths, and wellness treatments",
              },
              {
                icon: <FaHelicopter className="w-10 h-10 mx-auto text-amber-600 mb-6" />,
                title: "VIP Transfers",
                desc: "Private helicopter service between key locations for efficiency and views",
              },
              {
                icon: <UserCheck className="w-10 h-10 mx-auto text-amber-600 mb-6" />,
                title: "1:1 Guide Ratio",
                desc: "Dedicated expert guide and porter per guest for personalized attention",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center p-8 border border-slate-200 rounded-2xl bg-gradient-to-b from-white to-slate-50 hover:shadow-xl transition-shadow duration-300"
              >
                {icon}
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trek Showcase - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Signature Annapurna Journeys
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
              Handcrafted expeditions combining adventure with refined comfort
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <ExperienceSelector
              selected={selectedExperience}
              onChange={setSelectedExperience}
              options={[
                { value: "all", label: "All Experiences" },
                { value: "heli", label: "Helicopter Treks" },
                { value: "wellness", label: "Wellness Focused" },
                { value: "cultural", label: "Cultural Immersion" },
              ]}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Curating your luxury experiences...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Unable to load expeditions
                </h3>
                <p className="text-slate-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTreks.length === 0 && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <p className="text-slate-600 text-lg mb-6">
                  No treks match your selected experience. Try a different filter.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all duration-300"
                >
                  Request Custom Journey
                </Link>
              </div>
            </div>
          )}

          {/* Trek Grid */}
          {!loading && !error && filteredTreks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {filteredTreks.map((trek) => (
                <TrekCard
                  key={trek.slug || trek.id}
                  trek={trek}
                  region="annapurna"
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Guest Experiences
            </h3>
            <p className="text-lg text-slate-600">Stories from our luxury trekkers</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-2xl shadow-lg border border-slate-200"
              >
                <div className="mb-6">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-lg italic text-slate-700 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 text-lg">{t.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.location}</p>
                  <span className="text-sm text-amber-600 mt-1 block">{t.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-slate-600">Everything you need to know about luxury trekking</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(idx === activeFAQ ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-lg pr-4">{f.q}</span>
                  <span className="text-3xl text-amber-600 flex-shrink-0">
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

      {/* Inquiry CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Begin Your Luxury Journey
          </h3>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our trekking specialists are ready to craft your perfect Annapurna expedition. 
            Every journey is tailored to your preferences and aspirations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-amber-600 text-white font-medium rounded-full shadow-xl hover:bg-amber-700 transition-all duration-300 hover:scale-105"
            >
              Plan My Expedition
            </Link>
            <Link
              to="/treks"
              className="inline-block px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Explore All Treks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnapurnaLuxuryPage;
