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
    link: "/treks/everest-base-camp",
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
    <article className="blog-card group cursor-pointer">
      {/* Image & badge */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={trek.image}
          alt={trek.title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="category-badge">{trek.badge}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Meta: days, rating, reviews */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {/* <path d="M4 4 a1 1 0 0 0 -1 1 v1 H4 a2..." /> */}
              {/* calendar icon */}
            </svg>
            {trek.days} days
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            {trek.rating}
          </span>
          <span>({trek.reviews} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {trek.title}
        </h3>

        {/* Price */}
        <div className="text-xl font-semibold text-sky-600">${trek.price}</div>

        {/* View Details button */}
        <a href={trek.link} className="read-more-btn inline-block font-medium">
          View Details →
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
