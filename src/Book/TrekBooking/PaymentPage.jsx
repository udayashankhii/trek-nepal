import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CheckCircle, ShieldCheck } from "lucide-react";
import {
  completePaymentIntent,
  createCheckoutSession,
  createPaymentIntent,
  fetchBookingDetail,
} from "../../api/service/bookingServices";

const defaultStripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#0f172a",
      fontSize: "16px",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

const PaymentSuccess = ({ booking, onBack }) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-3xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Confirmed</h2>
      <p className="text-gray-600 mb-6">
        Your reservation is secured. A confirmation email (with the receipt link) has been sent to you.
      </p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-emerald-700">Booking Reference</p>
        <p className="text-lg font-semibold text-emerald-900">{booking?.booking_ref}</p>
      </div>

      <div className="text-left space-y-2 mb-6 text-sm text-gray-600">
        <p className="font-semibold text-gray-900">Trip</p>
        <p>{booking?.trek_title}</p>
        <p>
          {booking?.start_date} – {booking?.end_date}
        </p>
        <p className="font-semibold text-gray-900">
          Total Paid: {formatMoney(Number(booking?.total_amount || 0), booking?.currency || "USD")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {booking?.receipt_url ? (
          <a
            href={booking.receipt_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Download Receipt
          </a>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full border border-dashed border-emerald-200 text-emerald-700 font-semibold bg-emerald-50 cursor-not-allowed"
            disabled
          >
            Receipt will arrive shortly
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const PaymentCardForm = ({ clientSecret, booking, onSuccess, onError, onTerminalIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const submitPayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setCardError("Stripe is still loading. Please wait a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError("Card details are not ready. Please refresh the page.");
      return;
    }

    setProcessing(true);
    setCardError("");
    onError("");

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking?.lead_name || "",
            email: booking?.lead_email || "",
          },
        },
      });
      if (error) {
        const message = error.message || "Payment could not be completed.";
        const isTerminal = error.code === "payment_intent_unexpected_state" || /terminal state/i.test(message);
        setCardError(message);
        onError(message);
        if (isTerminal && onTerminalIntent) {
          onTerminalIntent();
        }
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        try {
          await onSuccess(paymentIntent);
        } catch (err) {
          const message = err?.message || "Payment completed but finalizing failed.";
          setCardError(message);
          onError(message);
          return;
        }
        return;
      }

      setCardError("We are processing your payment. Please follow any additional prompts from Stripe.");
      onError("Additional verification required. Check the Stripe modal.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
      onError(event.error.message);
    } else {
      setCardError("");
      onError("");
    }
  };

  const isDisabled = !stripe || !elements || processing;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 p-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
      </div>
      {cardError && <p className="text-sm text-red-600">{cardError}</p>}
      <button
        type="button"
        onClick={submitPayment}
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
          isDisabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
        }`}
      >
        {processing ? "Finalizing payment..." : "Pay Now"}
      </button>
      <p className="text-xs text-gray-500">
        Stripe handles 3D Secure and strong customer authentication automatically.
      </p>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [intentLoading, setIntentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stripePublicKey, setStripePublicKey] = useState(defaultStripePublicKey);
  const stripePromise = useMemo(
    () => (stripePublicKey ? loadStripe(stripePublicKey) : null),
    [stripePublicKey]
  );

  const bookingRef =
    location.state?.bookingRef ||
    searchParams.get("booking_ref") ||
    searchParams.get("bookingRef") ||
    "";

  const bookingStripeKey = booking?.stripe_publishable_key;

  const stripeReady = Boolean(stripePublicKey);

  const paymentSteps = [
    "Review the trip summary, dates, and total before you proceed.",
    "Enter your card details securely in the Stripe iframe.",
    "Receive instant confirmation, receipt, and the booking email.",
  ];
  const totalAmount = Number(booking?.total_amount || 0);
  const trekDays = useMemo(() => {
    if (!booking?.start_date || !booking?.end_date) return null;
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diffMs = end.getTime() - start.getTime();
    if (isNaN(diffMs)) return null;
    return Math.max(Math.round(diffMs / 86400000) + 1, 1);
  }, [booking?.start_date, booking?.end_date]);

  const loadBooking = async (ref) => {
    if (!ref) {
      setError("Missing booking reference.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchBookingDetail({ bookingRef: ref });
      setBooking(data);
      return data;
    } catch (err) {
      const message = err.message || "Unable to load booking details.";
      setError(message);
      if (message.toLowerCase().includes("session expired")) {
        const next = encodeURIComponent(`/payment?booking_ref=${ref}`);
        navigate(`/login?next=${next}`, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      if (!isActive) return;
      await loadBooking(bookingRef);
    };
    run();
    return () => {
      isActive = false;
    };
  }, [bookingRef]);

  useEffect(() => {
    if (bookingStripeKey && bookingStripeKey !== stripePublicKey) {
      setStripePublicKey(bookingStripeKey);
    }
  }, [bookingStripeKey, stripePublicKey]);

  const handleCheckoutRedirect = async () => {
    if (!bookingRef) return;
    setPaymentError("");
    setCheckoutLoading(true);
    try {
      const data = await createCheckoutSession({ bookingRef });
      const sessionId = data?.session_id;
      const url = data?.url;

      if (stripePromise && sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to initialize.");
        }
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result?.error) {
          setPaymentError(result.error.message || "Unable to redirect to checkout.");
        }
        return;
      }

      if (url) {
        window.location.assign(url);
        return;
      }

      setPaymentError("Unable to start checkout. Please try again.");
    } catch (err) {
      setPaymentError(err.message || "Unable to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const preparePaymentIntent = async (forceReload = false) => {
    if (!bookingRef) return;
    setPaymentError("");
    setConfirmationMessage("");
    if (!stripeReady) {
      await handleCheckoutRedirect();
      return;
    }

    if (!forceReload && clientSecret) {
      return;
    }

    setIntentLoading(true);
    try {
      const data = await createPaymentIntent({ bookingRef });
      setClientSecret(data.client_secret);
    } catch (err) {
      setPaymentError(err.message || "Unable to prepare payment. Please try again.");
    } finally {
      setIntentLoading(false);
    }
  };

  useEffect(() => {
    if (booking && stripeReady && !clientSecret && !intentLoading) {
      preparePaymentIntent();
    }
  }, [booking, stripeReady, clientSecret, intentLoading]);

  const handleTerminalIntent = async () => {
    setClientSecret("");
    setPaymentError("Your previous payment session expired. Creating a new payment intent...");
    await preparePaymentIntent(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setConfirmationMessage("Payment completed. Verifying your booking...");
    if (paymentIntent?.id) {
      try {
        await completePaymentIntent({ bookingRef, paymentIntentId: paymentIntent.id });
      } catch (err) {
        const message = err.message || "Unable to finalize payment.";
        setPaymentError(message);
        setConfirmationMessage("");
        return;
      }
    }
    const refreshed = await loadBooking(bookingRef);
    if (refreshed?.status === "paid") {
      navigate(`/payment/success?bookingRef=${refreshed.booking_ref}`);
    } else {
      setConfirmationMessage("Payment registered. Refresh this page if the status does not update soon.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading payment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-full bg-gray-900 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (booking?.status === "paid") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <PaymentSuccess booking={booking} onBack={() => navigate("/")} />
        </div>
      </div>
    );
  }

  const summaryItems = [
    { label: "Trek", value: booking?.trek_title },
    { label: "Days", value: trekDays ? `${trekDays} day${trekDays === 1 ? "" : "s"}` : "TBA" },
    { label: "Travel Dates", value: `${booking?.start_date} – ${booking?.end_date}` },
    { label: "Party Size", value: booking?.party_size },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-b from-white to-slate-100 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]"></div>
          <div className="flex items-center justify-between pb-8">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Secure checkout</h2>
              <p className="text-sm text-gray-500">Stripe-hosted card form, PCI scoped, TLS encrypted.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Protected
            </div>
          </div>

          <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Booking overview</p>
                <h3 className="text-xl font-semibold text-gray-900">Trip & traveler</h3>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {formatMoney(totalAmount, booking?.currency || "USD")}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr,0.6fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payment roadmap</p>
                <h3 className="text-lg font-semibold text-gray-900">Ready when you are</h3>
              </div>
              <div className="flex items-center justify-end text-sm font-semibold text-slate-900">
                Total: {formatMoney(totalAmount, booking?.currency || "USD")}
              </div>
            </div>

            <div className="grid gap-3">
              {paymentSteps.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-indigo-600 font-semibold shadow">
                    {index + 1}
                  </span>
                  <p>{label}</p>
                </div>
              ))}
            </div>

            {clientSecret && stripeReady && (
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 shadow-inner">
                <Elements stripe={stripePromise}>
                  <PaymentCardForm
                    clientSecret={clientSecret}
                    booking={booking}
                    onError={setPaymentError}
                    onSuccess={handlePaymentSuccess}
                    onTerminalIntent={handleTerminalIntent}
                  />
                </Elements>
              </div>
            )}

            {!clientSecret && (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Preparing secure payment form…
              </p>
            )}

            {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
            {confirmationMessage && !paymentError && (
              <p className="text-sm text-emerald-700">{confirmationMessage}</p>
            )}
          </div>

          <div className="mt-6 rounded-[26px] border border-slate-900/10 bg-slate-900 p-6 text-white/90">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Secure payment
            </div>
            <p className="mt-3 text-sm text-white/80">
              Stripe tokenizes your card details so we never store raw numbers. Billing data is encrypted in transit,
              and you can manage saved cards anytime from your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentPage;
