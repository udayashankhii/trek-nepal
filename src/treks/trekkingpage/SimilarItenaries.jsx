// src/components/trek/SimilarItineraries.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

// ✅ Static fallback treks (will be used if no props passed)
const fallbackTreks = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    image: "/trekking.png",
    days: 14,
    rating: 5.0,
    reviews: 261,
    price: 1525,
    badge: "BEST SELLER",
    link: "/mountainimage.avif",
  },
  {
    id: 2,
    title: "Annapurna Base Camp Trek",
    image: "/trekking.png",
    days: 11,
    rating: 4.9,
    reviews: 49,
    price: 1090,
    badge: "BEST PRICE",
    link: "/trekkinginnepal.jpg",
  },
  {
    id: 3,
    title: "Manaslu Circuit Trek",
    image: "/trekking.png",
    days: 13,
    rating: 4.8,
    reviews: 32,
    price: 1390,
    badge: "WILD & REMOTE",
    link: "/trekking.png",
  },
];

// ✅ Trek Card UI
function SimilarTrekCard({ trek }) {
  return (
    <article className="group bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl cursor-pointer">
      <div className="relative">
        <img
          src={trek.image}
          alt={trek.title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
        />
        {trek.badge && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            {trek.badge}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <span>{trek.days} Days</span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={14} />
            {trek.rating}
          </span>
          <span>({trek.reviews})</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition line-clamp-2">
          {trek.title}
        </h3>

        <div className="text-sky-600 text-xl font-semibold">${trek.price}</div>

        <Link
          to={trek.link || `/treks/${trek.slug}`}  // fallback to frontend routing if backend's link missing
          className="text-green-600 text-sm font-medium inline-flex items-center hover:underline"
        >
          View Details <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </article>
  );
}
export default function SimilarItineraries({ treks = fallbackTreks }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {treks.map((trek) => (
        <SimilarTrekCard key={trek.id} trek={trek} />
      ))}
    </section>
  );
}
