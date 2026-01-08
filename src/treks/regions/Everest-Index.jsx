// // src/pages/everest/EverestTrekIndex.jsx
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Loader2, AlertCircle } from "lucide-react";
// import TrekCard from "../TrekCard";
// import { fetchTreksByRegion } from "../../api/regionService";

// // Sample highlights
// const highlights = [
//   {
//     icon: "/icons/helicopter.svg",
//     title: "Helicopter Transfers",
//     desc: "Quick aerial transfers with breathtaking views",
//   },
//   {
//     icon: "/icons/lodge.svg",
//     title: "Luxury Lodges",
//     desc: "Five-star accommodations on the trail",
//   },
//   {
//     icon: "/icons/sherpa.svg",
//     title: "Expert Sherpa Guides",
//     desc: "Certified Sherpa guides for safety & culture",
//   },
// ];

// // Sample FAQs
// const faqs = [
//   {
//     q: "How is this luxury trek different from a standard trek?",
//     a: "We offer premium lodges, gourmet meals, helicopter flights, and small group sizes for comfort.",
//   },
//   {
//     q: "What fitness level is required?",
//     a: "Moderate fitness with basic acclimatization days—no extreme mountaineering experience needed.",
//   },
//   {
//     q: "Can I customize the itinerary?",
//     a: "Yes, contact us to tailor the trip duration, activities, or add acclimatization days.",
//   },
// ];

// export default function EverestTrekIndex() {
//   const [treks, setTreks] = useState([]);
//   const [activeFAQ, setActiveFAQ] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load only Everest-region treks from API
//   useEffect(() => {
//     const loadEverestTreks = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Adjust "everest" if your backend uses another region slug
//         const everestTreks = await fetchTreksByRegion("everest");

//         // If you want to guarantee only Everest Base Camp Trek:
//         // const filtered = everestTreks.filter(
//         //   (t) => t.slug === "everest-base-camp-trek"
//         // );
//         // setTreks(filtered);

//         setTreks(everestTreks);
//       } catch (err) {
//         console.error("Error loading Everest treks:", err);
//         setError(err.message || "Failed to load Everest treks");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadEverestTreks();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
//       {/* Hero Section */}
//       <section className="relative h-[65vh]">
//         <img
//           src="/annapurna.jpeg"
//           alt="Everest Luxury Trek"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/60" />
//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-lg"
//           >
//             Everest Trekking
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.8 }}
//             className="mt-4 text-lg md:text-xl text-yellow-200 max-w-2xl drop-shadow"
//           >
//             Experience the Himalayas in style: luxury lodges, gourmet dining,
//             and expert Sherpa guides.
//           </motion.p>
//         </div>
//       </section>

//       {/* Everest Trek Cards (API-backed) */}
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="mb-8">
//           <h2 className="text-3xl font-semibold text-gray-900">
//             Explore Our Everest Treks
//           </h2>
//         </div>

//         {/* Loading state */}
//         {loading && (
//           <div className="flex justify-center items-center min-h-[240px]">
//             <div className="text-center">
//               <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mx-auto mb-3" />
//               <p className="text-gray-600">Loading Everest treks...</p>
//             </div>
//           </div>
//         )}

//         {/* Error state */}
//         {!loading && error && (
//           <div className="flex justify-center items-center min-h-[240px]">
//             <div className="text-center max-w-md">
//               <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Unable to load treks
//               </h3>
//               <p className="text-gray-600 mb-4">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-6 py-2.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
//               >
//                 Try again
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && treks.length === 0 && (
//           <div className="flex justify-center items-center min-h-[240px]">
//             <p className="text-gray-600">
//               No Everest treks found. Please check back later.
//             </p>
//           </div>
//         )}

//         {/* Success state: Trek cards */}
//         {!loading && !error && treks.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {treks.map((trek) => (
//               <TrekCard
//                 key={trek.slug || trek.id || trek.public_id}
//                 trek={trek}
//                 region="everest"
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Highlights */}
//       <section className="bg-white py-16">
//         <div className="max-w-6xl mx-auto px-6">
//           <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">
//             Why Choose Us?
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {highlights.map((h, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.2 }}
//                 className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 rounded-xl shadow-lg"
//               >
//                 <img src={h.icon} alt={h.title} className="w-12 h-12 mb-4" />
//                 <h4 className="text-xl font-medium mb-2 text-gray-900">
//                   {h.title}
//                 </h4>
//                 <p className="text-gray-600">{h.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Embedded Video */}
//       <section className="max-w-5xl mx-auto px-6 py-16">
//         <h3 className="text-3xl font-semibold text-gray-900 text-center mb-8">
//           Journey Preview
//         </h3>
//         <div className="aspect-w-16 aspect-h-9">
//           <iframe
//             src="https://www.youtube.com/embed/VIDEO_ID?rel=0&autoplay=0"
//             title="Everest Luxury Trek Preview"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full h-full rounded-lg shadow-lg"
//           />
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="bg-slate-50 py-16">
//         <div className="max-w-5xl mx-auto px-6">
//           <h3 className="text-3xl font-semibold text-gray-800 text-center mb-12">
//             What Our Travelers Say
//           </h3>
//           <div className="grid md:grid-cols-2 gap-8">
//             {[
//               {
//                 text: "The experience was beyond our expectations…",
//                 name: "Alexandra M.",
//                 date: "Mar 2025",
//               },
//               {
//                 text: "Flawless service and breathtaking views…",
//                 name: "Rajiv S.",
//                 date: "Apr 2025",
//               },
//             ].map((t, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.2 }}
//                 className="bg-white p-8 rounded-xl shadow"
//               >
//                 <p className="italic text-gray-700 mb-4">“{t.text}”</p>
//                 <h4 className="font-medium text-gray-900">{t.name}</h4>
//                 <span className="text-sm text-gray-500">{t.date}</span>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="max-w-4xl mx-auto px-6 py-16">
//         <h3 className="text-3xl font-semibold text-gray-900 text-center mb-8">
//           FAQs
//         </h3>
//         <div className="space-y-4">
//           {faqs.map((f, idx) => (
//             <div key={idx} className="border-b">
//               <button
//                 onClick={() => setActiveFAQ(idx === activeFAQ ? null : idx)}
//                 className="w-full flex justify-between items-center py-4 text-left text-gray-800"
//               >
//                 <span>{f.q}</span>
//                 <span className="text-2xl">
//                   {idx === activeFAQ ? "−" : "+"}
//                 </span>
//               </button>
//               {idx === activeFAQ && (
//                 <p className="pb-4 text-gray-600">{f.a}</p>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Inquiry CTA */}
//       <section className="bg-white py-16 border-t">
//         <div className="max-w-3xl mx-auto px-6 text-center">
//           <h3 className="text-3xl font-semibold text-gray-900 mb-4">
//             Ready to Start Your Adventure?
//           </h3>
//           <p className="text-gray-600 mb-8">
//             Contact our luxury travel specialists for a personalized itinerary
//             and quote.
//           </p>
//           <Link
//             to="/contact"
//             className="inline-block px-8 py-3 bg-yellow-500 text-white font-medium rounded-full shadow hover:bg-yellow-600 transition"
//           >
//             Plan My Trek
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }



// src/pages/everest/EverestTrekIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import TrekCard from "../TrekCard";
import { useTreksByRegion } from "../../api/useTreksByRegion";
import { REGIONS } from "../../api/regionService";

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
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { treks, loading, error } = useTreksByRegion(REGIONS.EVEREST);

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

      {/* Trek Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Explore Our Everest Treks
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-600">Loading Everest treks...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex justify-center items-center min-h-[240px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to load treks
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && treks.length === 0 && (
          <div className="flex justify-center items-center min-h-[240px]">
            <p className="text-gray-600">
              No Everest treks found. Please check back later.
            </p>
          </div>
        )}

        {/* Trek Grid */}
        {!loading && !error && treks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <TrekCard
                key={trek.slug || trek.id}
                trek={trek}
                region="everest"
              />
            ))}
          </div>
        )}
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
