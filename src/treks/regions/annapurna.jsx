// src/pages/treks/AnnapurnaLuxuryPage.jsx
import React, { useState } from "react";
import {
  Sparkles,
  Mountain,
  Globe,
  UserCheck,
  Helicopter,
  Thermometer,
} from "lucide-react";
import { motion } from "framer-motion";
import TrekCard from "./Trekcard";

const AnnapurnaLuxuryPage = () => {
  const [selectedExperience, setSelectedExperience] = useState("all");

  const luxuryTreks = [
    {
      id: 1,
      title: "Annapurna Sanctuary Luxury Heli-Trek",
      price: 7500,
      duration: "9 Days",
      highlights: [
        "Private Helicopter Transfers",
        "Stay at Mountain Lodges of Annapurna",
        "Gourmet Dining Experience",
        "Private Spa Treatments",
      ],
      difficulty: "Luxury",
      altitude: "4,130m",
      includes: [
        "Hot Stone Baths",
        "Oxygen-Enriched Rooms",
        "Heli Rescue Insurance",
      ],
      image: "/annapurna-sanctuary-luxury.jpg",
      badge: "HELI RETURN",
    },
    {
      id: 2,
      title: "Poon Hill & Ghorepani Premium Trek",
      price: 5200,
      duration: "7 Days",
      highlights: [
        "Luxury Boutique Lodges",
        "Sunrise at Poon Hill",
        "Personal Cultural Guide",
        "Ayurvedic Wellness Sessions",
      ],
      difficulty: "Premium",
      altitude: "3,210m",
      includes: ["Private Transfers", "Massage Therapy", "4G Connectivity"],
      image: "/poon-hill-premium.jpg",
      badge: "BEST SELLER",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Luxury Hero Section */}
      <section className="relative h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/70" />
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          src="/annapurna-panorama.mp4"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold mb-6 font-serif tracking-wide"
          >
            Annapurna Luxury Expeditions
          </motion.h1>
          <p className="text-xl max-w-3xl mb-8 font-light">
            Experience the Annapurna range with unparalleled comfort - luxury
            lodges, private heli transfers, and bespoke Himalayan journeys
          </p>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="text-center p-6 border border-slate-100 rounded-xl">
            <Thermometer className="w-12 h-12 mx-auto text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Climate-Controlled Lodges
            </h3>
            <p className="text-slate-600">
              Heated rooms with oxygen enrichment systems
            </p>
          </div>
          <div className="text-center p-6 border border-slate-100 rounded-xl">
            <Sparkles className="w-12 h-12 mx-auto text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spa & Wellness</h3>
            <p className="text-slate-600">
              Daily massage therapy and hot stone baths
            </p>
          </div>
          <div className="text-center p-6 border border-slate-100 rounded-xl">
            <Helicopter className="w-12 h-12 mx-auto text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">VIP Transfers</h3>
            <p className="text-slate-600">
              Private helicopter between key locations
            </p>
          </div>
          <div className="text-center p-6 border border-slate-100 rounded-xl">
            <UserCheck className="w-12 h-12 mx-auto text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">1:1 Guide Ratio</h3>
            <p className="text-slate-600">
              Dedicated guide and porter per guest
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Trek Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Signature Annapurna Journeys
          </h2>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {luxuryTreks.map((trek) => (
              <TrekCard
                key={trek.id}
                trek={trek}
                onFavorite={() => {
                  /* Favorite logic */
                }}
                isFavorite={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Accommodation Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Annapurna Luxury Lodges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="/lodge-spa.jpg"
                alt="Spa Lodge"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 p-6 flex flex-col justify-end">
                <h3 className="text-2xl text-white font-semibold">
                  Sanctuary Spa Lodge
                </h3>
                <p className="text-slate-200 mt-2">
                  4,100m • Private hot stone therapy
                </p>
              </div>
            </div>
            {/* Add more lodge showcases */}
          </div>
        </div>
      </section>

      {/* Gourmet Dining Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Culinary Excellence
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                Michelin-Starred Himalayan Cuisine
              </h3>
              <p className="text-slate-600">
                Our executive chefs craft menus blending local ingredients with
                international techniques. Enjoy daily five-course meals paired
                with premium wines and artisanal teas.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Organic Farm-to-Table</span>
                </li>
                {/* Add more dining features */}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/gourmet-dining.jpg"
                alt="Dining Experience"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnapurnaLuxuryPage;
