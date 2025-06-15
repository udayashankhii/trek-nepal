// src/components/Itinerary.jsx
import React, { useState } from "react";

export default function Itinerary({
  days = [], // new
  itinerary = [], // backward‐compat
}) {
  // prefer days, else fallback to itinerary
  const allDays = days.length > 0 ? days : itinerary;

  const [openAll, setOpenAll] = useState(false);
  const [openDay, setOpenDay] = useState(null);

  const toggleAll = () => {
    if (openAll) {
      setOpenAll(false);
      setOpenDay(null);
    } else {
      setOpenAll(true);
      setOpenDay(null);
    }
  };

  const toggleDay = (index) => {
    // when "all" is open, ignore individual toggles
    if (openAll) return;
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <section className="space-y-6 bg-sky-50 p-6 rounded-2xl border border-sky-100 shadow-md">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-700">Itinerary</h2>
        <button
          onClick={toggleAll}
          className="text-orange-600 font-medium hover:underline"
        >
          {openAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* days list */}
      <div className="space-y-4">
        {allDays.map((dayData, i) => {
          // safe day number fallback
          const dayNumber = dayData.day ?? i + 1;
          const isOpen = openAll || openDay === i;

          return (
            <div
              key={dayData.day ?? i}
              className="border rounded-lg overflow-hidden shadow-sm bg-white"
            >
              {/* header bar */}
              <button
                className="w-full flex justify-between items-center px-4 py-3 bg-sky-100 hover:bg-sky-200 transition"
                onClick={() => toggleDay(i)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">📍</span>
                  <span className="font-medium">Day {dayNumber}:</span>
                  <span>{dayData.title}</span>
                </div>
                <span className="text-xl">{isOpen ? "−" : "+"}</span>
              </button>

              {/* expanded content */}
              {isOpen && (
                <div className="p-6 space-y-4 text-gray-700">
                  {/* description */}
                  {dayData.description && <p>{dayData.description}</p>}

                  {/* stats grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {dayData.accommodation && (
                      <p>
                        <strong>🏨 Accommodation:</strong>{" "}
                        {dayData.accommodation}
                      </p>
                    )}
                    {(dayData.altitude || dayData.elevation) && (
                      <p>
                        <strong>⛰️ Max Altitude:</strong>{" "}
                        {dayData.altitude ?? dayData.elevation}
                      </p>
                    )}
                    {dayData.duration && (
                      <p>
                        <strong>⏱️ Duration:</strong> {dayData.duration}
                      </p>
                    )}
                    {dayData.distance && (
                      <p>
                        <strong>📍 Distance:</strong> {dayData.distance}
                      </p>
                    )}
                    {dayData.meals && (
                      <p>
                        <strong>🍽️ Meals:</strong> {dayData.meals}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
