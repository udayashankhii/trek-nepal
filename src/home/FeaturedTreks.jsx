import React from "react";
import { Star } from "lucide-react";

const featuredTreks = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    image: "/everest.jpeg",
    days: 14,
    rating: 5.0,
    reviews: 261,
    price: 1525,
    badge: "BEST SELLER",
    link: "/treks/everest-base-camp-trek",
  },
  {
    id: 2,
    title: "Annapurna Base Camp Trek",
    image: "/annapurna.jpeg",
    days: 11,
    rating: 4.9,
    reviews: 49,
    price: 1090,
    badge: "BEST PRICE",
    link: "/treks/annapurna-base-camp",
  },
  {
    id: 3,
    title: "Manaslu Circuit Trek",
    image: "/trekkinginnepal.jpg",
    days: 13,
    rating: 4.8,
    reviews: 32,
    price: 1390,
    badge: "WILD & REMOTE",
    link: "/treks/manaslu-circuit",
  },
];

function FeaturedTrekCard({ trek }) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image & badge */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={trek.image}
          alt={trek.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {trek.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Meta: days, rating, reviews */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{trek.days} days</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {trek.rating}
          </span>
          <span>({trek.reviews} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {trek.title}
        </h3>

        {/* Price */}
        <div className="text-xl font-bold text-blue-600">${trek.price}</div>

        {/* View Details button */}
        <a 
          href={trek.link} 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </a>
      </div>
    </article>
  );
}

export default function FeaturedTreksGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
      {featuredTreks.map((trek) => (
        <FeaturedTrekCard key={trek.id} trek={trek} />
      ))}
    </div>
  );
}
