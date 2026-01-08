// src/components/PricingSidebar.jsx
import React from "react";
import { Star, CheckCircle, Shield } from "lucide-react";

/**
 * Booking Sidebar with Price Breakdown and Trek Highlights
 */
export default function PricingSidebar({
  trek,
  travellers,
  baseTotal,
  totalPrice,
  initialPayment,
  dueAmount,
  formatCurrency,
  highlights = [],
}) {
  const trekName = trek?.name || trek?.title || "Trek Booking";
  const rating = trek?.rating ?? "N/A";
  const reviews = trek?.reviews ?? 0;

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden sticky top-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h3 className="font-bold text-xl mb-2">{trekName}</h3>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
            <span>({reviews} reviews)</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Price Breakdown */}
          <PriceBreakdown
            travellers={travellers}
            baseTotal={baseTotal}
            totalPrice={totalPrice}
            initialPayment={initialPayment}
            dueAmount={dueAmount}
            formatCurrency={formatCurrency}
          />

          {/* Trek Highlights */}
          {highlights.length > 0 && <TrekHighlights highlights={highlights} />}

          {/* Payment Methods */}
          <PaymentMethods />

          {/* Security Badge */}
          <SecurityBadge />
        </div>
      </div>
    </aside>
  );
}

/**
 * Price Breakdown Component
 */
function PriceBreakdown({
  travellers,
  baseTotal,
  totalPrice,
  initialPayment,
  dueAmount,
  formatCurrency,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Base price × {travellers}</span>
          <span>{formatCurrency(baseTotal)}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex justify-between text-green-800 font-medium">
            <span>Pay now (20%)</span>
            <span>{formatCurrency(initialPayment)}</span>
          </div>
          <div className="flex justify-between text-green-600 text-sm mt-1">
            <span>Balance due</span>
            <span>{formatCurrency(dueAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Trek Highlights Component
 */
function TrekHighlights({ highlights }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">Trek Highlights</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        {highlights.map((highlight, index) => {
          const title =
            typeof highlight === "string"
              ? highlight
              : highlight.title ?? highlight.name ?? "";
          return (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Payment Methods Component
 */
function PaymentMethods() {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">We Accept</h4>
      <div className="flex items-center space-x-3 flex-wrap gap-2">
        <img src="/visa.png" alt="Visa" className="h-8" />
        <img src="/mastercard.png" alt="Mastercard" className="h-8" />
        <img src="/stripe.png" alt="Stripe" className="h-8" />
        <img src="/paypal.png" alt="PayPal" className="h-8" />
      </div>
    </div>
  );
}

/**
 * Security Badge Component
 */
function SecurityBadge() {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
      <p className="text-xs text-gray-600">
        Secure booking with 256-bit SSL encryption
      </p>
    </div>
  );
}
