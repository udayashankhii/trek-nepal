// src/pages/trekkingpage/BookingCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ShieldCheck,
  Clock,
  Headset,
  CreditCard,
  ThumbsUp,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * BookingCard Component
 * Displays trek pricing, group discounts, and booking options
 * 
 * @param {string} trekSlug - Trek slug for booking URL (preferred)
 * @param {string} trekId - Trek ID fallback for backwards compatibility
 * @param {string} trekName - Name of the trek
 * @param {number} basePrice - Base price per person
 * @param {number} original - Original price (for showing discount)
 * @param {Array} groups - Array of group pricing objects
 * @param {string} badgeLabel - Badge text to display
 * @param {boolean} securePayment - Show secure payment badge
 * @param {boolean} noHiddenFees - Show no hidden fees badge
 * @param {boolean} freeCancellation - Show free cancellation badge
 * @param {boolean} support247 - Show 24/7 support badge
 * @param {boolean} trustedReviews - Show trusted reviews badge
 * @param {Function} onCheckAvailability - Callback for availability check
 * @param {Function} onBookNow - Optional custom booking handler
 */
function BookingCard({
  trekSlug,
  trekId,
  trekName = "Trek",
  basePrice = 0,
  original = 0,
  groups = [],
  badgeLabel = "Explorer's Pick",
  securePayment = true,
  noHiddenFees = true,
  freeCancellation = false,
  support247 = true,
  trustedReviews = true,
  onCheckAvailability,
  onBookNow,
}) {
  const [showPrices, setShowPrices] = useState(false);
  const navigate = useNavigate();

  // Calculate savings percentage
  const savings =
    original > basePrice ? Math.round(((original - basePrice) / original) * 100) : 0;

  // Get trek identifier (prefer slug over ID)
  const trekIdentifier = trekSlug || trekId;

  // Handler for booking - uses trek_slug consistently
  const handleBookNowClick = () => {
    const slug = trekSlug || trekId;
    if (slug) {
        navigate(`/trek-booking?trekSlug=${slug}`);
    }
  };

  // Handler for availability check
  const handleCheckAvailability = () => {
    if (onCheckAvailability) {
      onCheckAvailability();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-4 space-y-4 text-slate-800 border border-slate-100"
    >
      {/* Price Section */}
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">From</p>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              ${basePrice.toLocaleString()}
            </span>
            {original > basePrice && (
              <span className="text-sm line-through text-slate-400 mb-0.5">
                ${original.toLocaleString()}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              Save {savings}%
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">Per person</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide">
          {badgeLabel}
        </span>
      </div>

      {/* Group Pricing Section */}
      {groups.length > 0 && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="w-full flex justify-between items-center bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            aria-expanded={showPrices}
            aria-label="Toggle group pricing"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Group Discount Available</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                showPrices ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {showPrices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-48 overflow-y-auto"
            >
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-600 font-semibold">
                      Group Size
                    </th>
                    <th className="px-3 py-2 text-right text-slate-600 font-semibold">
                      Price/Person
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g, idx) => (
                    <tr 
                      key={idx} 
                      className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2 text-slate-700">
                        {g.min_size && g.max_size
                          ? `${g.min_size}–${g.max_size} people`
                          : g.label || `${g.size || idx + 1} ${g.size === 1 ? 'person' : 'people'}`}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">
                        ${(g.price || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckAvailability}
          disabled={!onCheckAvailability}
          className="w-full bg-slate-800 text-white py-3 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Check Availability
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBookNowClick}
          disabled={!trekIdentifier}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Book Now
        </motion.button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
        {securePayment && (
          <div className="flex items-center space-x-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Secure Payment</span>
          </div>
        )}
        {noHiddenFees && (
          <div className="flex items-center space-x-1.5 text-slate-600">
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span>No Hidden Fees</span>
          </div>
        )}
        {freeCancellation && (
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Free Cancellation</span>
          </div>
        )}
        {support247 && (
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Headset className="w-4 h-4 flex-shrink-0" />
            <span>24/7 Support</span>
          </div>
        )}
        {trustedReviews && (
          <div className="flex items-center space-x-1.5 text-slate-600 col-span-2">
            <ThumbsUp className="w-4 h-4 flex-shrink-0" />
            <span>Trusted by 1000+ Travelers</span>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center">
          Best price guaranteed • Instant confirmation
        </p>
      </div>
    </motion.div>
  );
}

export default BookingCard;
