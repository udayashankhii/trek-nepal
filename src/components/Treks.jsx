import React, { useState } from "react";
import { Link } from "react-router-dom";

const treksByRegion = {
  Everest: [
    { name: "Everest Base Camp Trek", duration: "14 Days", popular: true },
    { name: "Sleep at Base Camp on Everest Trek", duration: "15 Days" },
    { name: "EBC Trek via Gokyo with Helicopter Return", duration: "15 Days", popular: true },
    { name: "EBC Trek Helicopter Return from Pheriche", duration: "11 Days" },
    { name: "Everest Three High Passes Trek", duration: "18 Days" },
    { name: "Budget Everest Base Camp Trek", duration: "12 Days" },
    { name: "Gokyo Valley Circuit Trek", duration: "13 Days" },
  ],
  Annapurna: [
    { name: "Annapurna Base Camp Trek", duration: "14 Days", popular: true },
    { name: "Annapurna North Base Camp Trek", duration: "12 Days" },
    { name: "Annapurna Circuit Trek", duration: "12 Days", popular: true },
    { name: "Full Annapurna Circuit Trek", duration: "17 Days" },
    { name: "Ghorepani Poonhill Trek", duration: "8 Days" },
    { name: "Mardi Himal Trek", duration: "9 Days", popular: true },
    { name: "Poon Hill Trek", duration: "2 Days" },
  ],
  Langtang: [
    { name: "Langtang Valley Trek", duration: "10 Days", popular: true },
    { name: "Langtang Gosainkunda Lake Trek", duration: "15 Days" },
    { name: "Helambu Circuit Trek", duration: "8 Days" },
    { name: "Tamang Heritage Trail Trek", duration: "10 Days" },
    { name: "Langtang Ganja La Pass Trek", duration: "14 Days" },
  ],
  Manaslu: [
    { name: "Manaslu Circuit Trek", duration: "14 Days", popular: true },
    { name: "Short Manaslu Trek", duration: "11 Days" },
    { name: "Manaslu Tsum Valley Trek", duration: "18 Days" },
    { name: "Manaslu Annapurna Circuit Trek", duration: "23 Days" },
    { name: "Tsum Valley Trek", duration: "15 Days" },
  ],
  Mustang: [
    { name: "Upper Mustang Trek", duration: "16 Days", popular: true },
    { name: "Upper Mustang Overland Tour", duration: "8 Days" },
    { name: "Upper Mustang Tiji Festival Tour", duration: "12 Days" },
  ],
};

const Treks = ({ minimal = false }) => {
  const [activeRegion, setActiveRegion] = useState(null);

  if (minimal) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.entries(treksByRegion)
          .slice(0, 2)
          .map(([region, list]) => (
            <div key={region}>
              <h3 className="text-base font-medium mb-2 text-gray-900">
                {region} Region
              </h3>
              <ul className="space-y-2.5">
                {list
                  .filter(trek => trek.popular)
                  .slice(0, 3)
                  .map((trek) => (
                    <li key={trek.name}>
                      <Link
                        to={`/tours/${trek.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-700 hover:text-green-600 transition-colors"
                      >
                        {trek.name} - {trek.duration}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      {Object.entries(treksByRegion).map(([region, list]) => (
        <div key={region} className="min-w-[200px]">
          <h3
            onClick={() => setActiveRegion(prev => prev === region ? null : region)}
            className={`cursor-pointer flex items-center gap-1.5 mb-3 font-semibold text-lg transition-colors ${
              activeRegion === region ? "text-green-600" : "text-gray-800 hover:text-green-500"
            }`}
          >
            {region} Region
            <ChevronIcon isOpen={activeRegion === region} />
          </h3>
          <ul
            className={`space-y-3 pl-1.5 transition-all duration-300 ${
              activeRegion && activeRegion !== region ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[1000px] opacity-100"
            }`}
          >
            {list.map((trek) => (
              <li key={trek.name} className="group">
                <Link
                  to={`/tours/${trek.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`block leading-relaxed hover:text-green-600 transition-colors ${
                    trek.popular ? "font-medium" : ""
                  }`}
                >
                  {trek.name} 
                  <span className="text-gray-500 group-hover:text-green-600 transition-colors"> - {trek.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const ChevronIcon = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
    viewBox="0 0 24 24"
  >
    <path 
      fill="currentColor" 
      d="M7 10l5 5 5-5z"
    />
  </svg>
);

export default Treks;
