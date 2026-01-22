// src/trekkingpage/DatesAndPrice.jsx
import React, { useState, useMemo, useEffect, forwardRef } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Constants
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DEFAULT_GROUP_PRICES = [
  { label: "1 Person", price: 1190, size: 1 },
  { label: "2 - 4 Person", price: 1090, size: 4 },
  { label: "5 - 7 Person", price: 1020, size: 7 },
  { label: "8 - 12 Person", price: 990, size: 12 },
];

const DEFAULT_HIGHLIGHTS = [
  "Top-Tier Safety Measures for Peace of Mind",
  "Tailored Adventures for Every Traveler",
  "Serving Adventure Seekers Since 2009",
];

const DatesAndPrice = forwardRef(
  (
    {
      dates = [],
      groupPrices = [],
      highlights = DEFAULT_HIGHLIGHTS,
      trekName = "Trek",
      trekId,
      className = "",
      onBookDate,
      ...restProps
    },
    ref
  ) => {
    // ✅ STATE: Initialize to null, will be set by useEffect
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedTab, setSelectedTab] = useState("group");
    const navigate = useNavigate();

    // ✅ Memoized normalized dates from API
    const normalizedDates = useMemo(() => {
      if (!Array.isArray(dates) || dates.length === 0) {
        return [];
      }
      return dates
        .map((date) => {
          const startDate = date.start || date.startDate || date.start_date;
          const endDate = date.end || date.endDate || date.end_date;
          const status = date.status || date.availability || "Available";
          const price = date.price || date.basePrice || date.cost || 0;
          if (!startDate || !endDate) return null;
          return {
            start: startDate,
            end: endDate,
            status: status,
            price: Number(price),
            id: date.id || `${startDate}-${endDate}`,
          };
        })
        .filter(Boolean);
    }, [dates]);

    // ✅ Normalized group prices
    const normalizedGroupPrices = useMemo(() => {
      if (!Array.isArray(groupPrices) || groupPrices.length === 0) {
        return DEFAULT_GROUP_PRICES;
      }
      return groupPrices
        .map((group) => {
          const label = group.label || group.name || `${group.size} Person${group.size > 1 ? 's' : ''}`;
          const price = group.price || group.cost || 0;
          const size = group.size || group.groupSize || 1;
          return {
            label: label,
            price: Number(price),
            size: Number(size),
          };
        })
        .sort((a, b) => a.size - b.size);
    }, [groupPrices]);

    // ✅ Memoized available months
    const availableMonths = useMemo(() => {
      if (normalizedDates.length === 0) return [dayjs().month()];
      const monthsSet = new Set(
        normalizedDates.map((d) => dayjs(d.start).month())
      );
      return Array.from(monthsSet).sort((a, b) => a - b);
    }, [normalizedDates]);

    // ✅ AUTO-SELECT first available month when data loads
    useEffect(() => {
      if (selectedMonth === null && availableMonths.length > 0) {
        setSelectedMonth(availableMonths[0]);
      } else if (selectedMonth !== null && !availableMonths.includes(selectedMonth)) {
        // If current selection is invalid, switch to first available
        setSelectedMonth(availableMonths[0]);
      }
    }, [availableMonths, selectedMonth]);

    // ✅ Filtered departures by selected month
    const filteredDepartures = useMemo(() => {
      if (selectedMonth === null) return [];
      return normalizedDates.filter(
        (d) => dayjs(d.start).month() === selectedMonth
      );
    }, [normalizedDates, selectedMonth]);

    // Navigation helpers
    const canGoPrevMonth = availableMonths.indexOf(selectedMonth) > 0;
    const canGoNextMonth =
      availableMonths.indexOf(selectedMonth) < availableMonths.length - 1;

    // ✅ Event handlers
    const handlePrevMonth = () => {
      const currentIndex = availableMonths.indexOf(selectedMonth);
      if (currentIndex > 0) setSelectedMonth(availableMonths[currentIndex - 1]);
    };

    const handleNextMonth = () => {
      const currentIndex = availableMonths.indexOf(selectedMonth);
      if (currentIndex < availableMonths.length - 1) {
        setSelectedMonth(availableMonths[currentIndex + 1]);
      }
    };

    const handleMonthSelect = (monthIndex) => {
      if (availableMonths.includes(monthIndex)) {
        setSelectedMonth(monthIndex);
      }
    };

    const handleBooking = (departure) => {
      if (onBookDate) {
        onBookDate(departure);
        return;
      }
      const bookingData = {
        date: departure.start,
        endDate: departure.end,
        price: departure.price,
        status: departure.status,
        trekType: selectedTab,
        trekName: trekName,
        trekId: trekId,
      };
      if (trekId) {
        navigate(`/trek-booking?trek_slug=${trekId}`, { state: bookingData });
      } else {
        navigate("/trek-booking", { state: bookingData });
      }
    };

    const handleCustomizeTrek = () => {
      if (trekId) {
        navigate(`/customize-trek?trek_id=${trekId}`);
      } else {
        console.error("Trek ID is missing");
        alert("Trek information is not available. Please select a trek first.");
      }
    };

    // ✅ RENDER
    return (
      <section
        ref={ref}
        className={`bg-blue-50 py-10 px-4 lg:px-0 ${className}`}
        {...restProps}
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <header className="mb-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cost and Date
              </h2>
              {/* Trip Type Tabs */}
              <div
                className="flex gap-2 mb-6"
                role="tablist"
                aria-label="Trek type selection"
              >
                <button
                  role="tab"
                  aria-selected={selectedTab === "group"}
                  aria-controls="group-content"
                  onClick={() => setSelectedTab("group")}
                  className={`px-6 py-2 rounded font-semibold flex items-center gap-2 transition-colors ${
                    selectedTab === "group"
                      ? "bg-blue-900 text-white"
                      : "bg-white border border-blue-900 text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  Group Joining
                </button>
                {/* <button
                  role="tab"
                  aria-selected={selectedTab === "private"}
                  aria-controls="private-content"
                  onClick={() => setSelectedTab("private")}
                  className={`px-6 py-2 rounded font-semibold flex items-center gap-2 transition-colors ${
                    selectedTab === "private"
                      ? "bg-blue-900 text-white"
                      : "bg-white border border-blue-900 text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  Private Trip
                </button> */}
              </div>
            </header>

            <div className="mb-4 text-gray-700">
              <p className="mb-2">
                <span className="font-semibold">Start Dates</span> refer to your
                arrival date in Nepal.{" "}
                <span className="font-semibold">End Dates</span> correspond to
                your return date from Nepal.
              </p>
            </div>

            <div className="mb-6 text-gray-700">
              <p>
                The {trekName} set departure dates are tailored for the group
                joining option. If the departure dates don't fit your schedule,
                we can arrange alternative dates that better suit your needs.
              </p>
            </div>

            {/* Month Navigation */}
            <div
              className="flex items-center gap-2 mb-6"
              aria-label="Month selection"
            >
              <button
                onClick={handlePrevMonth}
                disabled={!canGoPrevMonth}
                aria-label="Previous month"
                className="p-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <div
                className="flex gap-1 flex-wrap"
                role="group"
                aria-label="Month selection"
              >
                {MONTHS.map((month, index) => {
                  const isAvailable = availableMonths.includes(index);
                  const isSelected = selectedMonth === index;
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                      className={`px-4 py-2 rounded font-semibold transition-colors ${
                        isSelected
                          ? "bg-blue-900 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleNextMonth}
                disabled={!canGoNextMonth}
                aria-label="Next month"
                className="p-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Departure Cards */}
            <div
              className="space-y-4"
              role="region"
              aria-label="Available departure dates"
            >
              {filteredDepartures.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                  <p>No departure dates are currently available for this trek.</p>
                  <button
                    onClick={handleCustomizeTrek}
                    className="bg-blue-900 text-white px-8 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Plan Your Custom Trek →
                  </button>
                </div>
              ) : (
                filteredDepartures.map((departure) => (
                  <div
                    key={departure.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                        <div>
                          <div className="text-sm text-gray-500 font-medium">
                            Start Date
                          </div>
                          <div className="font-bold text-lg text-blue-900">
                            {dayjs(departure.start).format("D MMM YYYY")}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">
                            End Date
                          </div>
                          <div className="font-bold text-lg text-blue-900">
                            {dayjs(departure.end).format("D MMM YYYY")}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              departure.status.toLowerCase() === "guaranteed"
                                ? "bg-green-100 text-green-700"
                                : departure.status.toLowerCase() === "limited"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {departure.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-700">
                            Price from{" "}
                            <span className="text-2xl">
                              US${departure.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">per person</div>
                        </div>
                        <button
                          onClick={() => handleBooking(departure)}
                          className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                        >
                          Book this Date
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {/* Group Pricing */}
            {normalizedGroupPrices.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-bold mb-4 text-lg border-l-4 border-blue-600 pl-3">
                  Group size and price
                </h3>
                <ul className="space-y-3">
                  {normalizedGroupPrices.map((groupPrice, index) => (
                    <li
                      key={`${groupPrice.size}-${index}`}
                      className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium">{groupPrice.label}</span>
                      <span className="text-blue-700 font-bold text-lg">
                        US${groupPrice.price.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="font-bold text-lg mb-1 text-gray-900">
                  27,000+ Happy Travelers
                </div>
                <div className="text-blue-700 font-bold mb-4 text-sm">
                  52% plus repeated travelers
                </div>
                <ul className="space-y-2">
                  {highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 text-sm"
                    >
                      <span
                        className="text-blue-600 mt-1.5 block w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"
                        aria-hidden="true"
                      ></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleCustomizeTrek}
              className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg"
            >
              Plan your own Trip to Nepal →
            </button>
          </aside>
        </div>
      </section>
    );
  }
);

DatesAndPrice.displayName = "DatesAndPrice";

DatesAndPrice.propTypes = {
  dates: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    })
  ),
  groupPrices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      price: PropTypes.number,
      size: PropTypes.number,
    })
  ),
  highlights: PropTypes.arrayOf(PropTypes.string),
  trekName: PropTypes.string,
  trekId: PropTypes.string,
  className: PropTypes.string,
  onBookDate: PropTypes.func,
};

export default DatesAndPrice;
