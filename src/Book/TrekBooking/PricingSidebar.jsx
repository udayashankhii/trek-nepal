// src/pages/BookingPage/PricingSidebar.jsx
import React from "react";
import { Star, CheckCircle, Shield, Loader2, AlertTriangle } from "lucide-react";

/**
 * ✅ COMPLETE: Booking Sidebar with Real Price Breakdown and Trek Highlights
 */
export default function PricingSidebar({
  trek,
  travellers,
  basePrice,
  baseTotal,
  totalPrice,
  initialPayment,
  dueAmount,
  formatCurrency,
  highlights = [],
  quoteLoading = false,
  quoteError = null,
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
            basePrice={basePrice}
            baseTotal={baseTotal}
            totalPrice={totalPrice}
            initialPayment={initialPayment}
            dueAmount={dueAmount}
            formatCurrency={formatCurrency}
            quoteLoading={quoteLoading}
            quoteError={quoteError}
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
  basePrice,
  baseTotal,
  totalPrice,
  initialPayment,
  dueAmount,
  formatCurrency,
  quoteLoading,
  quoteError,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>

      {/* Loading State */}
      {quoteLoading && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
          <p className="text-xs text-blue-700 flex items-center">
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
            Calculating live pricing...
          </p>
        </div>
      )}

      {/* Error State */}
      {quoteError && !quoteLoading && (
        <div className="bg-amber-50 rounded-lg p-3 mb-3 border border-amber-200">
          <p className="text-xs text-amber-700 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-2" />
            Using estimated pricing. Live quote unavailable.
          </p>
        </div>
      )}

      <div className="space-y-3 text-sm">
        {/* Base Price Per Person */}
        {basePrice > 0 && (
          <div className="flex justify-between text-gray-600 text-xs pb-2 border-b border-gray-100">
            <span>Price per person</span>
            <span className="font-medium">{formatCurrency(basePrice)}</span>
          </div>
        )}

        {/* Base Total (Price × Travellers) */}
        <div className="flex justify-between text-gray-700">
          <span>
            Base price × {travellers} {travellers === 1 ? "person" : "people"}
          </span>
          <span className="font-medium">{formatCurrency(baseTotal)}</span>
        </div>

        <hr className="border-gray-200" />

        {/* Total Amount */}
        <div className="flex justify-between font-semibold text-lg pt-1">
          <span>Total</span>
          <span className="text-indigo-600">{formatCurrency(totalPrice)}</span>
        </div>

        {/* Payment Breakdown (20% down, 80% balance) */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-3">
          <div className="flex justify-between text-green-800 font-semibold mb-2">
            <span>Pay now (20%)</span>
            <span className="text-lg">{formatCurrency(initialPayment)}</span>
          </div>
          <div className="flex justify-between text-green-600 text-sm">
            <span>Balance due</span>
            <span className="font-medium">{formatCurrency(dueAmount)}</span>
          </div>
          <p className="text-xs text-green-700 mt-2 pt-2 border-t border-green-200">
            Balance payable before trek departure
          </p>
        </div>

        {/* Zero Price Warning */}
        {totalPrice === 0 && !quoteLoading && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-200 mt-2">
            <p className="text-xs text-red-700 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-2" />
              Pricing data unavailable. Please contact support.
            </p>
          </div>
        )}
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
        {highlights.slice(0, 5).map((highlight, index) => {
          const title =
            typeof highlight === "string"
              ? highlight
              : highlight.title ?? highlight.name ?? highlight.description ?? "";

          if (!title) return null;

          return (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">{title}</span>
            </li>
          );
        })}
      </ul>
      {highlights.length > 5 && (
        <p className="text-xs text-gray-500 mt-2">
          +{highlights.length - 5} more highlights
        </p>
      )}
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
        <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium text-gray-700">
          Visa
        </div>
        <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium text-gray-700">
          Mastercard
        </div>
        <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium text-gray-700">
          Khalti
        </div>
        <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium text-gray-700">
          PayPal
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Secure payment processing via Stripe & Khalti
      </p>
    </div>
  );
}

/**
 * Security Badge Component
 */
function SecurityBadge() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
      <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
      <p className="text-xs text-gray-700 font-medium mb-1">
        Secure Booking Guarantee
      </p>
      <p className="text-xs text-gray-600">
        256-bit SSL encryption • PCI DSS compliant
      </p>
    </div>
  );
}