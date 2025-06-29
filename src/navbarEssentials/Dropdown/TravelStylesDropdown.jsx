import React from "react";
import { Link } from "react-router-dom";

const travelStyles = [
  {
    name: "Tours",
    route: "/travel-styles/tours",
    icon: "🏛️",
    description: "Cultural tours & city exploration",
  },
  {
    name: "Jungle Safari",
    route: "/travel-styles/jungle-safari",
    icon: "🦏",
    description: "Chitwan & Bardia wildlife experiences",
  },
  {
    name: "Bike Rental",
    route: "/travel-styles/bike-rental",
    icon: "🚴",
    description: "Explore Nepal on two wheels",
  },
];

const TravelStylesDropdown = ({ onNavigate }) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 px-2 border-b border-gray-200 pb-2">
        Travel Styles
      </h3>
      <ul className="space-y-1">
        {travelStyles.map((style) => (
          <li key={style.name}>
            <Link
              to={style.route}
              onClick={onNavigate} // Close dropdown on click
              className="flex items-start space-x-3 px-3 py-3 text-sm text-gray-700 
                       hover:bg-green-50 hover:text-green-700 rounded-md transition-all duration-200
                       group border-b border-gray-50 last:border-b-0"
            >
              <span className="text-lg group-hover:scale-110 transition-transform mt-0.5">
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
    </div>
  );
};

export default TravelStylesDropdown;
