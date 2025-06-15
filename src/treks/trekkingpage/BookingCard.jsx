import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ShieldCheck,
  Clock,
  Headset,
  CreditCard,
  ThumbsUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Correct import

function BookingCard({
  basePrice,
  original,
  groups,
  mapLink,
  onCheckAvailability,
  trekId, // Ensure prop is received
}) {
  const [showPrices, setShowPrices] = useState(false);
  const navigate = useNavigate(); // Initialize hook
  const savings =
    original > basePrice
      ? Math.round(((original - basePrice) / original) * 100)
      : 0;

  const handleClick = () => {
    navigate(`/customize-trip?trip_id=${trekId}`); // Correct navigation
  };
  const handleBookNow = () => {
    navigate(`/trip-booking?trip_id=${trekId}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-4 space-y-4 text-slate-800"
    >
      {/* Price Header */}
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-xs text-slate-500 uppercase">From</p>
          <div className="flex items-end space-x-1">
            <span className="text-xl font-bold text-slate-900">
              ${basePrice}
            </span>
            {original > basePrice && (
              <span className="text-xs line-through text-slate-400">
                ${original}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-slate-600">Save {savings}%</p>
          )}
        </div>
        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-semibold uppercase">
          Explorer’s Pick
        </span>
      </div>

      {/* Group Price Dropdown */}
      <div>
        <button
          onClick={() => setShowPrices(!showPrices)}
          className="w-full flex justify-between items-center bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm"
        >
          <span>Group Price Available</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transform transition-transform ${
              showPrices ? "rotate-180" : ""
            }`}
          />
        </button>
        {showPrices && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded">
            <table className="w-full text-xs">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-600">People</th>
                  <th className="px-3 py-2 text-left text-slate-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-200 last:border-none"
                  >
                    <td className="px-3 py-1">{g.size} pax</td>
                    <td className="px-3 py-1">${g.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={onCheckAvailability}
        className="w-full bg-slate-800 text-white py-2 rounded text-sm font-medium"
      >
        Check Availability
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookNow}
        className="w-full bg-slate-600 text-white py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        Book Now
      </motion.button>
      <button
        className="w-full text-slate-600 py-2 rounded text-sm font-medium hover:text-slate-800"
        onClick={handleClick}
      >
        Customize Trip
      </button>
      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-1">
          <CreditCard className="w-4 h-4 text-slate-600" />
          <span>No Hidden Fees</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>Free Cancellation</span>
        </div>
        <div className="flex items-center space-x-1">
          <Headset className="w-4 h-4 text-slate-600" />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center space-x-1 col-span-2">
          <ThumbsUp className="w-4 h-4 text-slate-600" />
          <span>Trusted Reviews</span>
        </div>
      </div>
    </motion.div>
  );
}
export default BookingCard;
