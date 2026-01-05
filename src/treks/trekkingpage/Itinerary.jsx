// src/components/Itinerary.jsx
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp, MapPin, Home, Mountain, Clock, Route, Utensils } from "lucide-react";

export default function Itinerary({
  days = [],
  itinerary = [],
  defaultExpanded = false,
  allowMultiple = true,
  className = "",
}) {
  const allDays = days.length > 0 ? days : itinerary;
  
  const [expandedDays, setExpandedDays] = useState(
    defaultExpanded ? new Set(allDays.map((_, i) => i)) : new Set()
  );

  const toggleAll = useCallback(() => {
    if (expandedDays.size === allDays.length) {
      setExpandedDays(new Set());
    } else {
      setExpandedDays(new Set(allDays.map((_, i) => i)));
    }
  }, [expandedDays.size, allDays.length]);

  const toggleDay = useCallback((index) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) newSet.clear();
        newSet.add(index);
      }
      return newSet;
    });
  }, [allowMultiple]);

  const allExpanded = expandedDays.size === allDays.length;

  if (!allDays || allDays.length === 0) {
    return (
      <section className={`bg-white rounded-xl p-8 text-center border border-gray-100 ${className}`}>
        <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Itinerary</h2>
        <p className="text-sm text-gray-500">No itinerary details available</p>
      </section>
    );
  }

  return (
    <section 
      className={`space-y-4 bg-white p-5 md:p-6 rounded-xl border border-gray-200 ${className}`}
      aria-label="Trek itinerary"
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-700" />
            Itinerary
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{allDays.length} days</p>
        </div>
        
        <button
          onClick={toggleAll}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          aria-label={allExpanded ? "Collapse all" : "Expand all"}
        >
          {allExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span className="hidden sm:inline">Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span className="hidden sm:inline">Expand</span>
            </>
          )}
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-2" role="list">
        {allDays.map((dayData, index) => {
          const dayNumber = dayData.day ?? index + 1;
          const isExpanded = expandedDays.has(index);
          const accordionId = `day-${dayNumber}`;

          return (
            <div
              key={dayData.id || dayNumber}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              role="listitem"
            >
              {/* Header Button */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
                aria-expanded={isExpanded}
                aria-controls={accordionId}
                type="button"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {dayNumber}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm md:text-base">
                        {dayData.title || `Day ${dayNumber}`}
                      </span>
                    </div>
                    
                    {(dayData.altitude || dayData.duration) && (
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {dayData.altitude && (
                          <span className="flex items-center gap-1">
                            <Mountain className="w-3 h-3" />
                            {dayData.altitude}
                          </span>
                        )}
                        {dayData.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayData.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expanded Content */}
              <div
                id={accordionId}
                className={`grid transition-all duration-200 ease-in-out ${
                  isExpanded 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0'
                }`}
                role="region"
                aria-labelledby={accordionId}
              >
                <div className="overflow-hidden">
                  <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                    {/* Description */}
                    {dayData.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {dayData.description}
                      </p>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {dayData.accommodation && (
                        <InfoItem
                          icon={<Home className="w-3.5 h-3.5" />}
                          label="Accommodation"
                          value={dayData.accommodation}
                        />
                      )}
                      
                      {(dayData.altitude || dayData.elevation) && (
                        <InfoItem
                          icon={<Mountain className="w-3.5 h-3.5" />}
                          label="Altitude"
                          value={dayData.altitude || dayData.elevation}
                        />
                      )}
                      
                      {dayData.duration && (
                        <InfoItem
                          icon={<Clock className="w-3.5 h-3.5" />}
                          label="Duration"
                          value={dayData.duration}
                        />
                      )}
                      
                      {dayData.distance && (
                        <InfoItem
                          icon={<Route className="w-3.5 h-3.5" />}
                          label="Distance"
                          value={dayData.distance}
                        />
                      )}
                      
                      {dayData.meals && (
                        <InfoItem
                          icon={<Utensils className="w-3.5 h-3.5" />}
                          label="Meals"
                          value={dayData.meals}
                          className="sm:col-span-2"
                        />
                      )}
                      
                      {dayData.place_name && (
                        <InfoItem
                          icon={<MapPin className="w-3.5 h-3.5" />}
                          label="Location"
                          value={dayData.place_name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InfoItem({ icon, label, value, className = "" }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="flex-shrink-0 text-gray-400 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-gray-900 mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

Itinerary.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      day: PropTypes.number,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      accommodation: PropTypes.string,
      altitude: PropTypes.string,
      elevation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      duration: PropTypes.string,
      distance: PropTypes.string,
      meals: PropTypes.string,
      place_name: PropTypes.string,
    })
  ),
  itinerary: PropTypes.array,
  defaultExpanded: PropTypes.bool,
  allowMultiple: PropTypes.bool,
  className: PropTypes.string,
};
