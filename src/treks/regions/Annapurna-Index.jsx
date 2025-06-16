// src/pages/treks/AnnapurnaLuxuryPage.jsx
import React, { useState } from "react";
import { Sparkles, UserCheck, Thermometer } from "lucide-react";
import { FaHelicopter } from "react-icons/fa";
import { motion } from "framer-motion";
import ExperienceSelector from "./ExperienceSelector";
import TrekCard from "../TrekCard";

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

  // filter logic
  const filteredTreks = luxuryTreks.filter((t) => {
    if (selectedExperience === "all") return true;
    if (selectedExperience === "heli")
      return t.highlights.some((h) => /heli/i.test(h));
    if (selectedExperience === "wellness")
      return t.highlights.some((h) => /spa|massage|wellness/i.test(h));
    if (selectedExperience === "cultural")
      return t.highlights.some((h) => /cultural|guide/i.test(h));
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
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
            Experience the Annapurna range with unparalleled comfort— luxury
            lodges, private heli transfers, and bespoke Himalayan journeys
          </p>
        </div>
      </section>

      {/* USP Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          {[
            {
              icon: (
                <Thermometer className="w-12 h-12 mx-auto text-amber-600 mb-4" />
              ),
              title: "Climate-Controlled Lodges",
              desc: "Heated rooms with oxygen enrichment systems",
            },
            {
              icon: (
                <Sparkles className="w-12 h-12 mx-auto text-amber-600 mb-4" />
              ),
              title: "Spa & Wellness",
              desc: "Daily massage therapy and hot stone baths",
            },
            {
              icon: (
                <FaHelicopter className="w-12 h-12 mx-auto text-amber-600 mb-4" />
              ),
              title: "VIP Transfers",
              desc: "Private helicopter between key locations",
            },
            {
              icon: (
                <UserCheck className="w-12 h-12 mx-auto text-amber-600 mb-4" />
              ),
              title: "1:1 Guide Ratio",
              desc: "Dedicated guide and porter per guest",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="text-center p-6 border border-slate-100 rounded-xl"
            >
              {icon}
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trek Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            Signature Annapurna Journeys
          </h2>

          <div className="flex justify-center mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {" "}
            {filteredTreks.map((trek) => (
              <TrekCard
                key={trek.id}
                trek={trek} // ← pass the whole object
                isFavorite={false}
                onFavorite={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* (You can continue with Lodges & Dining sections here) */}
    </div>
  );
};

export default AnnapurnaLuxuryPage;
