import React from "react";
import { Link } from "react-router-dom";

const tours = [
  { name: "Best of Nepal Tour", duration: "14 Days", featured: true },
  { name: "Glimpse of Nepal Tour", duration: "8 Days", featured: true },
  {
    name: "Kathmandu Pokhara Chitwan Tour",
    duration: "9 Days",
    featured: true,
  },
  { name: "Nagarkot Hike Tour", duration: "5 Days" },
  { name: "Nepal Explore Tour", duration: "10 Days" },
  { name: "Lumbini Buddhist Pilgrimage", duration: "7 Days" },
  { name: "Kathmandu Valley Tour", duration: "4 Days" },
  { name: "Nepal Wildlife Safari", duration: "6 Days", featured: true },
];

const ToursDropdown = ({ minimal = false }) => {
  if (minimal) {
    return (
      <ul className="space-y-2.5">
        {tours
          .filter((tour) => tour.featured)
          .slice(0, 4)
          .map((tour) => (
            <li key={tour.name}>
              <Link
                to={`/tours/${tour.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-gray-700 hover:text-green-600 transition-colors"
              >
                {tour.name} - {tour.duration}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Featured Tours
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {tours.map((tour) => (
          <Link
            key={tour.name}
            to={`/tours/${tour.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`group flex items-center py-2 border-b border-gray-100 hover:border-green-200 transition-colors ${
              tour.featured ? "font-medium" : ""
            }`}
          >
            <span className="text-gray-800 group-hover:text-green-600 transition-colors">
              {tour.name}
              <span className="text-gray-500 font-normal ml-1.5">
                - {tour.duration}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToursDropdown;
