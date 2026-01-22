
import React, { useEffect, useState } from "react";
import { fetchAllTreks } from "../api/trekService";
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

export default function Treks({ onNavigate }) {
  const [treksByRegion, setTreksByRegion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRegions, setExpandedRegions] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        
        if (!isMobile) {
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
  }, [isMobile]);

  const toggleRegion = (regionName) => {
    if (!isMobile) return;
    
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
            <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
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
<div className="w-full overflow-x-hidden px-3 sm:px-4 md:px-5">


      {/* Desktop: Grid Layout - All Expanded */}
     <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">

        {STATIC_REGIONS.map((region) => {
          const list = treksByRegion[region.name] || [];
          return (
            <div key={region.slug} className="flex flex-col min-w-0">
              {/* Region Header */}
              <Link
                to={`/treks/${region.slug}`}
                className={`flex-shrink-0 bg-white rounded-xl border-2 ${region.borderColor} 
                           px-3 py-2.5 hover:shadow-md transition-all duration-200
                           group mb-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
                      {region.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {list.length} Trek{list.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Treks List */}
              <div className="space-y-2 flex-1">
                {list.length === 0 ? (
                  <div className="text-center py-6 px-3 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-xs italic">No treks available</p>
                  </div>
                ) : (
                  list.map((trek) => (
                    <Link
                      key={trek.id || trek.slug}
                      to={`/treks/${region.slug}/${trek.slug || trek.title.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={onNavigate}
                      className="block bg-white hover:bg-gray-50 border border-gray-200 
                               rounded-lg p-2.5 transition-all duration-200 
                               hover:shadow-md hover:border-gray-300"
                    >
                      <h4 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug line-clamp-2">
                        {trek.title}
                      </h4>
                      {trek.duration && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs font-medium truncate">
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

      {/* Mobile: Accordion Layout */}
      <div className="md:hidden space-y-2.5">
        {STATIC_REGIONS.map((region) => {
          const list = treksByRegion[region.name] || [];
          const isExpanded = expandedRegions.has(region.name);
          
          return (
            <div 
              key={region.slug}
              className={`bg-white rounded-xl border-2 ${region.borderColor} overflow-hidden`}
            >
              <button
                onClick={() => toggleRegion(region.name)}
                className="w-full px-3 py-3 flex items-center justify-between gap-2 
                         active:bg-gray-50 transition-colors"
                type="button"
              >
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
                    {region.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {list.length} Trek{list.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronIcon isOpen={isExpanded} />
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-3 pb-3 pt-2 space-y-2 border-t border-gray-200">
                  {list.length === 0 ? (
                    <div className="text-center py-6 px-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-400 text-xs italic">No treks available</p>
                    </div>
                  ) : (
                    list.map(trek => (
                      <Link
                        key={trek.id || trek.slug}
                        to={`/treks/${region.slug}/${trek.slug || trek.title.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={onNavigate}
                        className="block bg-gray-50 active:bg-gray-100 
                                 rounded-lg p-3 transition-colors 
                                 min-h-[60px] touch-manipulation"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">
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
    </div>
  );
}

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 text-gray-400 flex-shrink-0 ${
      isOpen ? 'rotate-180' : ''
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);
