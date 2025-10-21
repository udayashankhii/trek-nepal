

// Treks.jsx
import React, { useEffect, useState } from "react";
import { fetchAllTreks } from "../api/regionService";
import { Link } from "react-router-dom";

const STATIC_REGIONS = [
  { name: "Everest", slug: "everest" },
  { name: "Annapurna", slug: "annapurna" },
  { name: "Langtang", slug: "langtang" },
  { name: "Manaslu", slug: "manaslu" },
  { name: "Mustang", slug: "mustang" },
];

export default function Treks({ onNavigate }) {
  const [treksByRegion, setTreksByRegion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRegion, setActiveRegion] = useState(null);

  useEffect(() => {
    const loadTreks = async () => {
      setLoading(true);
      setError("");
      try {
        const allTreks = await fetchAllTreks();
        // Robust region matching
        const grouped = STATIC_REGIONS.reduce((acc, region) => {
          const staticNormalized = region.name.toLowerCase().replace(/[\s-]/g, "");
          acc[region.name] = allTreks.filter(trek => {
            const trekRegion =
              (trek.region_name || trek.region || "").toLowerCase().replace(/[\s-]/g, "");
            return trekRegion.includes(staticNormalized);
          });
          return acc;
        }, {});
        setTreksByRegion(grouped);
      } catch (err) {
        setError("Failed to load treks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTreks();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading treks...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {STATIC_REGIONS.map(region => {
          const list = treksByRegion[region.name] || [];
          return (
            <div key={region.slug} className="space-y-4">
              <h3 className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Link
                  to={`/treks/${region.slug}`}
                  className="flex-1 text-sm font-semibold text-slate-900 uppercase tracking-wider hover:text-emerald-600 transition-colors"
                >
                  {region.name} Region
                </Link>
                <button
                  onClick={() =>
                    setActiveRegion(prev => (prev === region.name ? null : region.name))
                  }
                  className="p-1"
                >
                  <ChevronIcon isOpen={activeRegion === region.name} />
                </button>
              </h3>
              <ul
                className={`space-y-3 transition-all duration-300 ${
                  activeRegion && activeRegion !== region.name
                    ? "max-h-0 opacity-0 overflow-hidden"
                    : "max-h-[1000px] opacity-100"
                }`}
              >
                {list.length === 0 ? (
                  <li className="text-slate-400 text-xs italic">No treks available.</li>
                ) : (
                  list.map(trek => (
                    <li key={trek.id || trek.slug} className="flex items-start justify-between group py-1">
                      <Link
                        to={`/treks/${region.slug}/${trek.slug || trek.title.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={onNavigate}
                        className="text-slate-700 font-medium text-sm hover:text-emerald-600 transition-colors duration-200 flex-1 mr-3 leading-relaxed"
                      >
                        {trek.title}
                      </Link>
                      <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 shrink-0 mt-0.5">
                        {trek.duration?.toLowerCase() || ""}
                      </span>
                    </li>
                  ))
                )}
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
    className={`w-3 h-3 transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);
