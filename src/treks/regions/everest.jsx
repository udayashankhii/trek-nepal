// pages/everest/EverestTrekIndex.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import TrekCard from "../../components/TrekCard";
import { Search, Filter } from "lucide-react";

// Sample data for premium Everest treks
const treks = [
  {
    id: 1,
    image: "/images/everest-luxury-heli.jpg",
    title: "Luxury Everest Base Camp Trek & Heli Return",
    days: 10,
    price: 6999,
    reviews: 38,
    rating: 5,
    badge: "LUXURY",
    location: "Everest Base Camp",
    groupSize: 8,
  },
  {
    id: 2,
    image: "/images/gokyo-lakes-premium.jpg",
    title: "Gokyo Lakes & Renjo La Pass Premium Trek",
    days: 14,
    price: 6290,
    reviews: 25,
    rating: 5,
    badge: "PREMIUM",
    location: "Gokyo Valley",
    groupSize: 10,
  },
  {
    id: 3,
    image: "/images/everest-panorama.jpg",
    title: "Everest Panorama Luxury Lodge Trek",
    days: 8,
    price: 5190,
    reviews: 19,
    rating: 4,
    badge: "LUXURY",
    location: "Namche, Tengboche",
    groupSize: 12,
  },
  {
    id: 4,
    image: "/images/everest-classic.jpg",
    title: "Classic Everest Base Camp Trek",
    days: 14,
    price: 3999,
    reviews: 52,
    rating: 4,
    badge: "HELI RETURN",
    location: "Everest Base Camp",
    groupSize: 14,
  },
];

export default function EverestTrekIndex() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const filteredTreks = treks.filter((trek) =>
    trek.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <img
          src="/images/everest-hero.jpg"
          alt="Everest Region"
          className="w-full h-[60vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6 drop-shadow-xl font-serif"
          >
            Everest Region <span className="text-yellow-400">Luxury Treks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-2xl text-center max-w-2xl mb-10 font-light"
          >
            Experience the Himalayas in style with curated, ultra-premium trekking adventures-helicopter returns, luxury lodges, gourmet dining, and expert Sherpa guides.
          </motion.p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Everest Region Treks</h2>
            <p className="text-gray-600">Premium journeys for discerning adventurers</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Everest treks..."
                className="py-3 px-6 w-full rounded-full border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800 shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-600" size={20} />
            </div>
            <button className="flex items-center gap-2 py-3 px-5 border border-yellow-300 rounded-full bg-yellow-50 hover:bg-yellow-100 transition shadow">
              <Filter size={18} />
              <span className="font-medium text-yellow-800">Filters</span>
            </button>
          </div>
        </div>

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTreks.map((trek) => (
            <TrekCard
              key={trek.id}
              {...trek}
              isFavorite={favorites.includes(trek.id)}
              onFavorite={() => toggleFavorite(trek.id)}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16 border-t border-yellow-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Trek Everest With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8 rounded-2xl shadow flex flex-col items-center text-center">
              <img src="/icons/helicopter.svg" alt="" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Helicopter Transfers</h3>
              <p className="text-gray-600">Save time and enjoy breathtaking aerial views with heli flights to and from the mountains.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8 rounded-2xl shadow flex flex-col items-center text-center">
              <img src="/icons/lodge.svg" alt="" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Luxury Lodges</h3>
              <p className="text-gray-600">Stay at the region’s finest lodges, with private rooms, gourmet cuisine, and hot showers.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8 rounded-2xl shadow flex flex-col items-center text-center">
              <img src="/icons/sherpa.svg" alt="" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Sherpa Guides</h3>
              <p className="text-gray-600">Trek with Nepal’s most experienced guides for safety, culture, and unforgettable insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Client Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow border border-yellow-100">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                “The luxury Everest trek was beyond our expectations-helicopter flights, five-star lodges, and the best guides. Worth every penny!”
              </p>
              <div className="flex items-center gap-4">
                <img src="/avatars/client1.jpg" alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold">Alexandra M.</h4>
                  <p className="text-sm text-gray-500">USA, March 2025</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow border border-yellow-100">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                “From the moment we landed in Kathmandu, everything was seamless and first-class. Highly recommended for luxury travelers!”
              </p>
              <div className="flex items-center gap-4">
                <img src="/avatars/client2.jpg" alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold">Rajiv S.</h4>
                  <p className="text-sm text-gray-500">India, April 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
