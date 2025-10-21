import React from "react";
import TrekCard from "../treks/TrekCard";

const featuredTreks = [
  {
    slug: "everest-base-camp-trek",
    title: "Everest Base Camp Trek",
    image: "/everest.jpeg",
    days: 14,
    rating: 5,
    reviews: 261,
    price: 1525,
    badge: "BEST SELLER",
    region: "everest",
  },
  {
    slug: "annapurna-base-camp",
    title: "Annapurna Base Camp Trek",
    image: "/annapurna.jpeg",
    days: 11,
    rating: 4.9,
    reviews: 49,
    price: 1090,
    badge: "BEST PRICE",
    region: "annapurna",
  },
  {
    slug: "manaslu-circuit",
    title: "Manaslu Circuit Trek",
    image: "/trekkinginnepal.jpg",
    days: 13,
    rating: 4.8,
    reviews: 32,
    price: 1390,
    badge: "WILD & REMOTE",
    region: "manaslu",
  },
];

export default function HomeFeaturedTreks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
      {featuredTreks.map((trek) => (
        <TrekCard key={trek.slug} trek={trek} variant="detailed" showDetails />
      ))}
    </div>
  );
}
