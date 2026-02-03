
import React, { useEffect, useState } from "react";
import { fetchAllTreks } from "../api/service/trekService";
import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";

const STATIC_REGIONS = [
  {
    name: "EVEREST",
    slug: "everest",
    aliases: ["everest", "khumbu", "sagarmatha"]
  },
  {
    name: "ANNAPURNA",
    slug: "annapurna",
    aliases: ["annapurna"]
  },
  {
    name: "LANGTANG",
    slug: "langtang",
    aliases: ["langtang"]
  },
  {
    name: "MANASLU",
    slug: "manaslu",
    aliases: ["manaslu", "manasalu"]
  },
  {
    name: "MUSTANG",
    slug: "mustang",
    aliases: ["mustang", "upper mustang", "lower mustang"]
  }
];

export default function Treks({ onNavigate, variant = "grid" }) {
  const [treksByRegion, setTreksByRegion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // For accordion mode, track expanded regions
  const [expandedRegions, setExpandedRegions] = useState(new Set());

  useEffect(() => {
    const loadTreks = async () => {
      setLoading(true);
      setError("");
      try {
        const allTreks = await fetchAllTreks();

        const grouped = STATIC_REGIONS.reduce((acc, region) => {
          acc[region.name] = allTreks.filter(trek => {
            const trekRegionFields = [
              trek.region_name,
              trek.region,
              trek.regionName,
              trek.location,
              trek.area,
              trek.title,
            ].filter(Boolean);
            const normalizedTrekRegions = trekRegionFields.map(field =>
              field.toLowerCase().replace(/[\s-_]/g, "")
            );

            return region.aliases.some(alias => {
              const normalizedAlias = alias.toLowerCase().replace(/[\s-_]/g, "");
              return normalizedTrekRegions.some(trekRegion =>
                trekRegion.includes(normalizedAlias)
              );
            });
          });

          return acc;
        }, {});

        setTreksByRegion(grouped);

        // Auto-expand all for grid view, or just specific ones if needed
        if (variant === "grid") {
          setExpandedRegions(new Set(STATIC_REGIONS.map(r => r.name)));
        }
      } catch (err) {
        setError("Failed to load treks.");
        console.error("Error loading treks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTreks();
  }, [variant]);

  const toggleRegion = (regionName) => {
    if (variant === "grid") return;

    setExpandedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(regionName)) {
        newSet.delete(regionName);
      } else {
        newSet.add(regionName);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="w-full py-8 sm:py-12">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16">
            <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-t-yellow-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading treks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-red-800 font-semibold text-sm sm:text-base mb-1">Failed to load treks</p>
          <p className="text-red-600 text-xs sm:text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* GRID LAYOUT (Use when variant="grid") */}
      {variant === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATIC_REGIONS.map((region) => {
            const list = treksByRegion[region.name] || [];
            return (
              <div key={region.slug} className="flex flex-col min-w-0">
                {/* Region Header */}
                <Link
                  to={`/treks/${region.slug}`}
                  className={`flex-shrink-0 bg-white rounded-xl border border-gray-200 
                             px-3 py-3 hover:shadow-md hover:border-yellow-500/30 transition-all duration-300
                             group mb-3 relative overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-between gap-2 pl-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate group-hover:text-yellow-700 transition-colors">
                        {region.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium uppercase tracking-wider">
                        {list.length} {list.length === 1 ? 'Adventure' : 'Adventures'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:translate-x-1 group-hover:text-yellow-600 transition-all" />
                  </div>
                </Link>

                {/* Treks List */}
                <div className="space-y-2 flex-1">
                  {list.length === 0 ? (
                    <div className="text-center py-6 px-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-xs italic">Coming soon</p>
                    </div>
                  ) : (
                    list.map((trek) => (
                      <Link
                        key={trek.id || trek.slug}
                        to={`/treks/${region.slug}/${trek.slug || trek.title.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={onNavigate}
                        className="group block bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 
                                 rounded-lg p-2.5 transition-all duration-200 
                                 hover:shadow-sm relative"
                      >

                        <h4 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 mb-1 leading-snug line-clamp-2">
                          {trek.title}
                        </h4>
                        {trek.duration && (
                          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-yellow-600 transition-colors">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-bold tracking-wide">
                              {trek.duration}
                            </span>
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACCORDION LAYOUT (Use when variant="accordion") */}
      {variant === "accordion" && (
        <div className="space-y-3">
          {STATIC_REGIONS.map((region) => {
            const list = treksByRegion[region.name] || [];
            const isExpanded = expandedRegions.has(region.name);

            return (
              <div
                key={region.slug}
                className={`bg-white rounded-xl border transition-colors duration-200 overflow-hidden ${isExpanded ? 'border-yellow-500/30 ring-1 ring-yellow-500/10' : 'border-gray-200'}`}
              >
                <button
                  onClick={() => toggleRegion(region.name)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 
                           active:bg-gray-50 transition-colors"
                  type="button"
                >
                  <div className="flex-1 text-left min-w-0">
                    <h3 className={`text-sm font-bold uppercase tracking-wide truncate transition-colors ${isExpanded ? 'text-yellow-700' : 'text-gray-900'}`}>
                      {region.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {list.length} Trek{list.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronIcon isOpen={isExpanded} />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-3 pb-3 pt-1 space-y-2 border-t border-gray-100/50">
                    {list.length === 0 ? (
                      <div className="text-center py-4 px-3 bg-gray-50 rounded-lg m-2">
                        <p className="text-gray-400 text-xs italic">No treks available</p>
                      </div>
                    ) : (
                      list.map(trek => (
                        <Link
                          key={trek.id || trek.slug}
                          to={`/treks/${region.slug}/${trek.slug || trek.title.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={onNavigate}
                          className="block bg-gray-50 hover:bg-yellow-50 active:bg-yellow-100 
                                   rounded-lg p-3 transition-colors border border-transparent hover:border-yellow-200
                                   touch-manipulation"
                        >
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                            {trek.title}
                          </h4>
                          {trek.duration && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="text-xs font-medium">
                                {trek.duration}
                              </span>
                            </div>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 text-gray-400 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
      }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);
