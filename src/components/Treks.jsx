import React, { useState } from "react";
import { Link } from "react-router-dom";

const treksByRegion = {
  Everest: [
    { name: "Everest Base Camp Trek", duration: "14 Days", popular: true },
    { name: "Sleep at Base Camp on Everest Trek", duration: "15 Days" },
    {
      name: "EBC Trek via Gokyo with Helicopter Return",
      duration: "15 Days",
      popular: true,
    },
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

export default function Treks({ minimal = false }) {
  const [activeRegion, setActiveRegion] = useState(null);

  if (minimal) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {Object.entries(treksByRegion)
          .slice(0, 2)
          .map(([region, list]) => (
            <div key={region} className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                {region} Region
              </h3>
              <ul className="space-y-3">
                {list.map((trek) => {
                  const slug = trek.name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li
                      key={trek.name}
                      className="flex items-center justify-between group"
                    >
                      <Link
                        to={`/treks/${slug}`}
                        className="text-slate-800 font-medium text-sm hover:text-emerald-600 transition-colors duration-200 flex-1 mr-3"
                      >
                        {trek.name}
                      </Link>
                      <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                        {trek.duration.toLowerCase()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {Object.entries(treksByRegion).map(([region, list]) => {
          // <-- declare regionSlug here
          const regionSlug = region.toLowerCase();
          return (
            <div key={region} className="space-y-4">
              <h3 className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {/* region name navigates */}
                <Link
                  to={`/treks/${regionSlug}`}
                  className="flex-1 text-sm font-semibold text-slate-900 uppercase tracking-wider hover:text-emerald-600 transition-colors"
                >
                  {region} Region
                </Link>
                {/* only this button toggles collapse */}
                <button
                  onClick={() =>
                    setActiveRegion((prev) => (prev === region ? null : region))
                  }
                  className="p-1"
                >
                  <ChevronIcon isOpen={activeRegion === region} />
                </button>
              </h3>
              <ul
                className={`space-y-3 transition-all duration-300 ${
                  activeRegion && activeRegion !== region
                    ? "max-h-0 opacity-0 overflow-hidden"
                    : "max-h-[1000px] opacity-100"
                }`}
              >
                {list.map((trek) => {
                  const slug = trek.name.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <li
                      key={trek.name}
                      className="flex items-start justify-between group py-1"
                    >
                      <Link
                        to={`/treks/${regionSlug}/${slug}`}
                        className="text-slate-700 font-medium text-sm hover:text-emerald-600 transition-colors duration-200 flex-1 mr-3 leading-relaxed"
                      >
                        {trek.name}
                      </Link>
                      <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 shrink-0 mt-0.5">
                        {trek.duration.toLowerCase()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-3 h-3 transition-transform duration-300 text-slate-400 ${
      isOpen ? "rotate-180" : ""
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);
