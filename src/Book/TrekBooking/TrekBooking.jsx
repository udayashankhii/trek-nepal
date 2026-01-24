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
import { getBookingQuote } from "../../api/service/bookingServices.js";

import { useBookingForm } from "../../hooks/useBookingForm.js";
import { useFormValidation } from "../../hooks/useFormValidation.js";
import { fetchTrekBookingData } from "../../api/service/trekService.js";

export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Get trek slug from URL parameters OR from location state (fallback)
  const trekSlug =
    searchParams.get("trekSlug") ||
    searchParams.get("trekslug") ||
    searchParams.get("trek_slug") ||
    searchParams.get("slug") ||
    location.state?.slug;

  const [hero, setHero] = useState(null);
  const [trek, setTrek] = useState(null);
  const [bookingCardData, setBookingCardData] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Hooks must be at top
  const bookingForm = useBookingForm(trek, hero);
  const validation = useFormValidation(
    bookingForm.lead,
    bookingForm.startDate,
    bookingForm.travellers,
    bookingForm.accepted
  );

  // Quote State
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // Fetch Quote
  useEffect(() => {
    if (!trekSlug) return;

    let active = true;
    const controller = new AbortController();

    const fetchQuote = async () => {
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const data = await getBookingQuote({
          trekSlug,
          partySize: bookingForm.travellers,
          bookingIntent: null,
        });
        if (active) {
          setQuote(data);
          setQuoteLoading(false);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          console.error("Quote fetch error:", err);
          setQuoteError(err.message);
          setQuoteLoading(false);
        }
      }
    };

    // Debounce slightly
    const timeoutId = setTimeout(fetchQuote, 500);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug, bookingForm.travellers]);

  // Calculate prices
  const basePrice = useMemo(() => {
    if (quote?.unit_price) return parseFloat(quote.unit_price);
    if (loading || !trek) return 0;

    return parseFloat(
      bookingCardData?.base_price ||
      trek?.booking_card?.base_price ||
      trek?.base_price ||
      trek?.price ||
      1000
    );
  }, [loading, bookingCardData, trek, quote]);

  const totalPrice = useMemo(() => {
    if (quote?.total_amount) return parseFloat(quote.total_amount);
    return basePrice * bookingForm.travellers;
  }, [quote, basePrice, bookingForm.travellers]);

  const baseTotal = basePrice * bookingForm.travellers;
  const initialPayment = +(totalPrice * 0.20).toFixed(2);
  const dueAmount = +(totalPrice - initialPayment).toFixed(2);
  const currency = quote?.currency || trek?.currency || "USD";

  const handleFormSubmit = useCallback(
    (e) => {
      bookingForm.handleBookingSubmit(e, validation.formValid, totalPrice, trekSlug, currency);
    },
    [bookingForm, validation.formValid, totalPrice, trekSlug, currency]
  );

  // Fetch Main Trek Data
  useEffect(() => {
    if (!trekSlug) {
      setError("Trek not specified");
      setLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchTrekBookingData(trekSlug)
      .then((result) => {
        if (!mounted) return;
        if (!result || !result.trek) throw new Error("Invalid trek data");

        setHero(result.hero || {});
        setTrek(result.trek || {});
        setBookingCardData(result.bookingCard || {});
        setHighlights(result.highlights || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Failed to load trek booking data:", err);
        setError(err.message || "Failed to load trek details");
        setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [trekSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Unable to Start Booking</h2>
          <p className="text-gray-600 mb-6">{error || "Trek not found"}</p>
          <button
            onClick={() => (window.location.href = "/treks")}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Treks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BookingPageHero hero={hero} trek={trek} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 space-y-8">
                <FormHeader
                  title={`Book ${trek.name || "Your Trek"}`}
                  subtitle="Complete your booking in one simple form"
                />

                <TripDetailsSection
                  startDate={bookingForm.startDate}
                  setStartDate={bookingForm.setStartDate}
                  endDate={bookingForm.endDate}
                  travellers={bookingForm.travellers}
                  setTravellers={bookingForm.setTravellers}
                  duration={hero?.duration || trek.duration || "N/A"}
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

          {/* RIGHT: Sidebar */}
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
