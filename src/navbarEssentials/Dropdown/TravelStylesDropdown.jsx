import React from "react";
import { Link } from "react-router-dom";

// Update route paths as needed to match your app routes!
const travelStyles = [
  { name: "Tours", route: "/travel-styles", icon: "🏛️", description: "Cultural tours & city exploration" },
  // { name: "Jungle Safari", route: "/travel-activities/jungle-safari", icon: "🦏", description: "Chitwan & Bardia wildlife experiences" },
  // { name: "Bike Rental", route: "/bike-rental", icon: "🚴", description: "Explore Nepal on two wheels" },
];


const TravelStylesDropdown = ({ onNavigate }) => (
  <nav
    aria-label="Travel styles"
    className="bg-white rounded-lg shadow space-y-1 p-3 w-full max-w-xs"
  >
    <h3 className="text-sm font-semibold text-gray-800 mb-3 px-2 border-b border-gray-200 pb-2">
      Travel Styles
    </h3>
    <ul className="space-y-1">
      {travelStyles.map((style) => (
        <li key={style.name}>
          <Link
            to={style.route}
            onClick={onNavigate}
            className="flex items-start space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-all duration-200 group border-b border-gray-50 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <span
              className="text-xl group-hover:scale-110 transition-transform mt-0.5"
              aria-hidden="true"
            >
              {style.icon}
            </span>
            <div className="flex-1">
              <span className="font-medium block group-hover:text-green-800">
                {style.name}
              </span>
              <span className="text-xs text-gray-500 mt-0.5 block group-hover:text-green-600">
                {style.description}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default TravelStylesDropdown;
