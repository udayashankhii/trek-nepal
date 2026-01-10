// src/Book/PaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CheckCircle, Lock, ShieldCheck } from "lucide-react";
import {
  createPaymentIntent,
  fetchBookingDetail,
  markBookingPaid,
  saveBillingDetails,
} from "../api/bookingServices";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a",
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const PaymentForm = ({ bookingRef, booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [billing, setBilling] = useState({
    name: booking?.lead_name || "",
    email: booking?.lead_email || "",
    phone: booking?.lead_phone || "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    const fetchIntent = async () => {
      try {
        const data = await createPaymentIntent(bookingRef);
        if (isActive) {
          setClientSecret(data.client_secret);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to initialize payment.");
        }
      }
    };

    if (bookingRef) {
      fetchIntent();
    }
    return () => {
      isActive = false;
    };
  }, [bookingRef]);

  useEffect(() => {
    if (!booking) return;
    setBilling((prev) => ({
      ...prev,
      name: booking.lead_name || prev.name,
      email: booking.lead_email || prev.email,
      phone: booking.lead_phone || prev.phone,
    }));
  }, [booking]);

  const handleChange = (e) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Save billing details first
      await saveBillingDetails(bookingRef, billing);

      // Confirm card payment
      const cardElement = elements.getElement(CardNumberElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billing.name,
              email: billing.email,
              phone: billing.phone,
              address: {
                line1: billing.address1,
                line2: billing.address2,
                city: billing.city,
                state: billing.state,
                postal_code: billing.postalCode,
                country: billing.country,
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setStatus("succeeded");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  if (status === "succeeded") {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h2>
        <p className="text-gray-600 mb-6">
          Your booking is confirmed. A confirmation email and receipt have been sent.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-emerald-700">Booking Reference</p>
          <p className="text-lg font-semibold text-emerald-900">{bookingRef}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Lock className="w-4 h-4 mr-2" />
          SSL Protected
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Cardholder Name</label>
          <input
            name="name"
            value={billing.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="Name on card"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={billing.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="you@email.com"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Card Number</label>
          <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:border-indigo-500">
            <CardNumberElement options={elementStyle} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">CVC</label>
          <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:border-indigo-500">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Expiry</label>
          <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus-within:border-indigo-500">
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Phone</label>
          <input
            name="phone"
            value={billing.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Billing Address</label>
        <input
          name="address1"
          value={billing.address1}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
          placeholder="Street address"
          required
        />
        <input
          name="address2"
          value={billing.address2}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
          placeholder="Apartment, suite, unit (optional)"
        />
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="city"
            value={billing.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="City"
            required
          />
          <input
            name="state"
            value={billing.state}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="State"
          />
          <input
            name="postalCode"
            value={billing.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
            placeholder="Postal code"
            required
          />
        </div>
        <input
          name="country"
          value={billing.country}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
          placeholder="Country"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !clientSecret || !stripe}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
          processing || !clientSecret || !stripe
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {processing ? "Processing Payment..." : "Pay Securely"}
      </button>

      <div className="flex items-center justify-center text-xs text-gray-500 gap-2">
        <ShieldCheck className="w-4 h-4" />
        Powered by Stripe. We accept Visa, Mastercard, Amex, and more.
      </div>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [devPaid, setDevPaid] = useState(false);
  const [devMessage, setDevMessage] = useState("");

  const bookingRef =
    location.state?.bookingRef ||
    searchParams.get("booking_ref") ||
    searchParams.get("bookingRef") ||
    "";

  const stripeReady = useMemo(() => Boolean(stripePublicKey), []);
  const isDev = useMemo(() => Boolean(import.meta.env.DEV), []);

  // ✅ Debug logs
  useEffect(() => {
    console.log("📦 Payment page location.state:", location.state);
    console.log("📋 bookingRef:", bookingRef, "type:", typeof bookingRef);
  }, [location.state, bookingRef]);

  useEffect(() => {
    let isActive = true;
    const loadBooking = async () => {
      if (!bookingRef) {
        setError("Missing booking reference.");
        setLoading(false);
        return;
      }

      // ✅ Verify bookingRef is a string
      if (typeof bookingRef !== 'string') {
        console.error("❌ bookingRef is not a string:", bookingRef);
        setError("Invalid booking reference format.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      
      try {
        console.log("📤 Fetching booking details for:", bookingRef);
        // ✅ FIXED: Pass string directly, not as object
        const data = await fetchBookingDetail(bookingRef);
        console.log("✅ Booking details loaded:", data);
        
        if (isActive) {
          setBooking(data);
        }
      } catch (err) {
        if (!isActive) return;
        console.error("❌ Failed to load booking:", err);
        const message = err.message || "Unable to load booking details.";
        setError(message);
        
        if (message.toLowerCase().includes("session expired")) {
          const next = encodeURIComponent(`/payment?booking_ref=${bookingRef}`);
          navigate(`/login?next=${next}`, { replace: true });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadBooking();
    return () => {
      isActive = false;
    };
  }, [bookingRef, navigate]);

  if (!stripeReady && !isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600">
            Stripe publishable key missing. Please configure VITE_STRIPE_PUBLISHABLE_KEY.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Payment</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (devPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Marked as Paid
            </h2>
            <p className="text-gray-600 mb-6">
              {devMessage || "Payment confirmed in development mode."}
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-emerald-700">Booking Reference</p>
              <p className="text-lg font-semibold text-emerald-900">{bookingRef}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {stripeReady && stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm bookingRef={bookingRef} booking={booking} />
            </Elements>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center text-gray-600">
              Stripe is not configured yet. Use the dev payment button to complete this booking.
            </div>
          )}
        </div>

        <aside className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Summary</h3>
            <p className="text-sm text-gray-600">{booking?.trek_title || "Trek Booking"}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Ref</span>
              <span className="font-semibold text-gray-900">{booking?.booking_ref}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Travel Dates</span>
              <span className="text-gray-900">
                {booking?.start_date} - {booking?.end_date}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Party Size</span>
              <span className="text-gray-900">{booking?.party_size} {booking?.party_size === 1 ? 'person' : 'people'}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total Due</span>
              <span>
                {formatMoney(parseFloat(booking?.total_amount || 0), booking?.currency || "USD")}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
            <Lock className="w-4 h-4 inline mr-2" />
            Your payment is encrypted and processed by Stripe. We never store your card details.
          </div>

          {isDev && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 mb-3">
                Dev mode only: bypass Stripe to mark the booking as paid.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    // ✅ FIXED: Pass string directly, not as object
                    const updated = await markBookingPaid(bookingRef);
                    setBooking(updated);
                    setDevMessage("Confirmation email and receipt generated.");
                    setDevPaid(true);
                  } catch (err) {
                    setError(err.message || "Unable to mark booking as paid.");
                  }
                }}
                className="w-full py-3 rounded-xl border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 transition"
              >
                Mark as Paid (Dev)
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
