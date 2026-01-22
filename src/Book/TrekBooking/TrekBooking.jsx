
// src/pages/BookingPage/SinglePageBookingForm.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

import BookingPageHero from "./BookingPageHero.jsx";
import {
  FormHeader,
  TripDetailsSection,
  PersonalInfoSection,
  AdditionalInfoSection,
  TravelTimesSection,
  TermsAndSubmitSection,
} from "./BookingForm.jsx";
import PricingSidebar from "./PricingSidebar.jsx";

import { useBookingForm } from "../../hooks/useBookingForm.js";
import { useFormValidation } from "../../hooks/useFormValidation.js";
import { fetchTrekBookingData } from "../../api/trekService.js";

export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Get trek slug from URL parameters OR from location state (fallback)
  const trekSlug =
    searchParams.get("trekSlug") ||
    searchParams.get("trekslug") ||
    searchParams.get("trek_slug") ||  // used by Datesandprice.jsx
    searchParams.get("slug") ||
        // alternative state key
    location.state?.slug;             // another alternative

  const [hero, setHero] = useState(null);
  const [trek, setTrek] = useState(null);
  const [bookingCardData, setBookingCardData] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CRITICAL: ALL HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  const bookingForm = useBookingForm(trek, hero);
  const validation = useFormValidation(
    bookingForm.lead,
    bookingForm.startDate,
    bookingForm.travellers,
    bookingForm.accepted
  );

  // ✅ New: Quote State
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // ✅ Fetch Quote when trekSlug or travellers change
  useEffect(() => {
    if (!trekSlug) return;

    let active = true;
    const controller = new AbortController();

    const fetchQuote = async () => {
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const { getBookingQuote } = await import("../../api/bookingServices.js");
        const data = await getBookingQuote(
          { trekSlug, partySize: bookingForm.travellers },
          true,
          { signal: controller.signal }
        );
        if (active) {
          setQuote(data);
          setQuoteLoading(false);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          console.error("Quote fetch error:", err);
          // Don't show critical error, just fallback (or set state to show warning)
          setQuoteError(err.message);
          setQuoteLoading(false);
        }
      }
    };

    // Debounce slightly to avoid rapid calls while spinning inputs
    const timeoutId = setTimeout(fetchQuote, 300);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug, bookingForm.travellers]);


  // Calculate pricing - Prioritize Backend Quote
  const basePrice = useMemo(() => {
    // If we have a backend quote, use its unit_price
    if (quote?.unit_price) {
      return parseFloat(quote.unit_price);
    }

    if (loading || !trek) return 0;

    const price = bookingCardData?.base_price
      || trek?.booking_card?.base_price
      || trek?.base_price
      || trek?.price
      || 1000;

    return parseFloat(price);
  }, [loading, bookingCardData, trek, quote]);

  const totalPrice = useMemo(() => {
    // If we have a backend quote, use its total_amount
    if (quote?.total_amount) {
      return parseFloat(quote.total_amount);
    }
    return basePrice * bookingForm.travellers;
  }, [quote, basePrice, bookingForm.travellers]);

  const baseTotal = basePrice * bookingForm.travellers; // For display breakdown

  const initialPayment = +(totalPrice * 0.20).toFixed(2);
  const dueAmount = +(totalPrice - initialPayment).toFixed(2);
  const currency = quote?.currency || trek?.currency || "USD";

  const handleFormSubmit = useCallback(
    (e) => {
      bookingForm.handleBookingSubmit(e, validation.formValid, totalPrice, trekSlug, currency);
    },
    [bookingForm, validation.formValid, totalPrice, trekSlug, currency]
  );

  // ✅ Fetch data - runs once
  useEffect(() => {
    if (!trekSlug) {
      setError("Trek slug is required");
      setLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        setError("Request timed out. Please refresh.");
        setLoading(false);
      }
    }, 15000);

    setLoading(true);
    setError(null);

    fetchTrekBookingData(trekSlug, { signal: controller.signal })
      .then((result) => {
        if (!mounted) return;

        clearTimeout(timeoutId);

        if (!result || !result.trek) {
          throw new Error("Invalid data received");
        }

        setHero(result.hero || {});
        setTrek(result.trek || {});
        setBookingCardData(result.bookingCard || {});
        setHighlights(result.highlights || []);
        setLoading(false);

      })
      .catch((err) => {
        if (!mounted) return;

        clearTimeout(timeoutId);
        setError(err.message || "Failed to load trek");
        setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug]);

  // ✅ NOW we can return conditionally - AFTER all hooks

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading trek details…</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !trek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Unable to Load Trek</h2>
          <p className="text-gray-600 mb-6">{error || "Trek not found"}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/treks")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Browse All Treks
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE - RENDER FORM
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BookingPageHero hero={hero} trek={trek} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 space-y-8">
                <FormHeader
                  title={`Book ${trek?.title || trek?.name || "Your Trek"}`}
                  subtitle="Complete your booking in one simple form"
                />

                <TripDetailsSection
                  startDate={bookingForm.startDate}
                  setStartDate={bookingForm.setStartDate}
                  endDate={bookingForm.endDate}
                  travellers={bookingForm.travellers}
                  setTravellers={bookingForm.setTravellers}
                  duration={hero?.duration || trek?.duration || "N/A"}
                />

                <PersonalInfoSection
                  lead={bookingForm.lead}
                  changeLead={bookingForm.changeLead}
                  countryList={bookingForm.countryList}
                  validation={validation}
                />

                <AdditionalInfoSection
                  preferences={bookingForm.preferences}
                  changePreferences={bookingForm.changePreferences}
                />

                <TravelTimesSection
                  departureTime={bookingForm.departureTime}
                  setDepartureTime={bookingForm.setDepartureTime}
                  returnTime={bookingForm.returnTime}
                  setReturnTime={bookingForm.setReturnTime}
                  formatNepalTime={bookingForm.formatNepalTime}
                />

                <TermsAndSubmitSection
                  accepted={bookingForm.accepted}
                  setAccepted={bookingForm.setAccepted}
                  formValid={validation.formValid}
                  submitting={bookingForm.submitting}
                />
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN - PRICING */}
          <div className="lg:col-span-1">
            <PricingSidebar
              trek={trek}
              travellers={bookingForm.travellers}
              basePrice={basePrice}
              baseTotal={baseTotal}
              totalPrice={totalPrice}
              initialPayment={initialPayment}
              dueAmount={dueAmount}
              formatCurrency={(amt) => bookingForm.formatCurrency(amt, currency)}
              highlights={highlights}
              quoteLoading={quoteLoading}
              quoteError={quoteError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
