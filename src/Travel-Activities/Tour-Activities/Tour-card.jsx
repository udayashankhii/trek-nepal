import React from "react";
import { Link } from "react-router-dom"; // or just 'a' if using plain links

export default function TourCard({ title, description, img, price, duration, link, reviews, reviewsCount }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition duration-300">
      <img src={img} alt={title} className="h-48 object-cover w-full" />
      <div className="flex-1 flex flex-col p-5">
        <h2 className="font-bold text-xl mb-2 text-teal-900">{title}</h2>
        <p className="text-gray-700 flex-1 mb-3">{description}</p>
        <div className="flex items-center justify-between text-sm mt-auto">
          <span className="font-semibold text-primary">{price}</span>
          <span className="text-gray-600">⏱ {duration}</span>
        </div>
        <div className="flex items-center mt-2 gap-2 text-yellow-500">
          <span>★{reviews}</span>
          <span className="text-gray-500">({reviewsCount} reviews)</span>
        </div>
        <Link
          to={link}
          className="mt-4 inline-block text-white font-bold bg-gradient-to-r from-teal-500 to-blue-500 px-4 py-2 rounded-md shadow hover:shadow-lg transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
