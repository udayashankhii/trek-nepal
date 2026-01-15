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
import { useNavigate } from "react-router-dom";

export default function TourBookingCard({
  tour,
  selectedGroup,
  onSelectGroup,
  badgeLabel = "Explorer's Pick",
  securePayment = false,
  noHiddenFees = false,
  freeCancellation = false,
  support247 = false,
  trustedReviews = false,
  onCheckAvailability,
}) {
  const [showPrices, setShowPrices] = useState(false);
  const navigate = useNavigate();
  const basePrice = Number(tour?.basePrice ?? tour?.base_price ?? tour?.price ?? 0);
  const original = Number(tour?.originalPrice ?? tour?.original_price ?? tour?.oldPrice ?? 0);
  const groupPrices = tour?.groupPrices ?? tour?.group_prices ?? [];
  const savings =
    original > basePrice ? Math.round(((original - basePrice) / original) * 100) : 0;
  const badgeText = badgeLabel || tour?.badge || "Explorer's Pick";

  const handleBookNowClick = () => {
    if (tour?.slug) {
      navigate(`/plan?tour=${tour.slug}&price=${basePrice}`);
    } else {
      navigate("/plan");
    }
  };

  const getGroupLabel = (tier, idx) => {
    if (tier.min_size && tier.max_size) {
      return `${tier.min_size}–${tier.max_size} pax`;
    }
    return tier.size || tier.label || `${idx + 1} pax`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-4 space-y-4 text-slate-800"
    >
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-xs text-slate-500 uppercase">From</p>
          <div className="flex items-end space-x-1">
            <span className="text-xl font-bold text-slate-900">${basePrice}</span>
            {original > basePrice && (
              <span className="text-xs line-through text-slate-400">${original}</span>
            )}
          </div>
          {savings > 0 && <p className="text-xs text-slate-600">Save {savings}%</p>}
        </div>
        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-semibold uppercase">
          {badgeText}
        </span>
      </div>

      {groupPrices.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPrices(!showPrices)}
            className="w-full flex justify-between items-center bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
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
                  {groupPrices.map((tier, idx) => {
                    const label = getGroupLabel(tier, idx);
                    const isSelected = label === selectedGroup;
                    return (
                      <tr
                        key={label}
                        className={`border-t border-slate-200 last:border-none ${
                          isSelected ? "bg-emerald-50" : ""
                        }`}
                      >
                        <td className="px-3 py-1">
                          <button
                            type="button"
                            onClick={() => onSelectGroup?.(label)}
                            className="w-full text-left"
                          >
                            {label}
                          </button>
                        </td>
                        <td className="px-3 py-1">${tier.price || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckAvailability}
        disabled={!onCheckAvailability}
        className="w-full bg-slate-800 text-white py-2 rounded text-sm font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Check Availability
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookNowClick}
        className="w-full bg-slate-600 text-white py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        Book Now
      </motion.button>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
        {securePayment && (
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Secure Payment</span>
          </div>
        )}
        {noHiddenFees && (
          <div className="flex items-center space-x-1">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span>No Hidden Fees</span>
          </div>
        )}
        {freeCancellation && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Free Cancellation</span>
          </div>
        )}
        {support247 && (
          <div className="flex items-center space-x-1">
            <Headset className="w-4 h-4 text-slate-600" />
            <span>24/7 Support</span>
          </div>
        )}
        {trustedReviews && (
          <div className="flex items-center space-x-1 col-span-2">
            <ThumbsUp className="w-4 h-4 text-slate-600" />
            <span>Trusted Reviews</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
