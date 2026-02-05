



// src/pages/BookingPage/SinglePageBookingForm.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

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
import WeatherRiskWarning from "./WeatherRiskWarning.jsx"; // ⭐ NEW
import { getBookingQuote } from "../../api/service/bookingServices.js";
import { getTrekRiskPrediction } from "../../api/service/trekRisk.js"; // ⭐ NEW

import { useBookingForm } from "../../hooks/useBookingForm.js";
import { useFormValidation } from "../../hooks/useFormValidation.js";
import { fetchTrekBookingData } from "../../api/service/trekService.js";
import { getAccessToken } from "../../api/auth/auth.api.js"; // ✅ Import to check auth on mount

export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
const navigate = useNavigate(); // ✅ Add this

  // ✅ Check authentication on component mount
  // useEffect(() => {
  //   const token = getAccessToken();
  //   if (!token) {
  //     console.log('⚠️ No auth token found, redirecting to login');
  //     navigate('/login', {
  //       state: {
  //         backgroundLocation: location
  //       },
  //       replace: true
  //     });
  //   }
  // }, [location, navigate]);

  // ✅ Get trek slug from URL params
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

  // ✅ Hooks
  const bookingForm = useBookingForm(trek, hero);
  const validation = useFormValidation(
    bookingForm.lead,
    bookingForm.startDate,
    bookingForm.travellers,
    bookingForm.accepted
  );
  // ⭐ NEW: Weather Risk Prediction State
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState(null);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);

  // ✅ Initialize dates from URL params
 

  // ✅ Initialize dates from URL params
  useEffect(() => {
    const s = searchParams.get("startDate") || searchParams.get("date");
    const e = searchParams.get("endDate");

    console.log('📅 Initializing dates from URL:', { startDate: s, endDate: e });

    if (s) {
      bookingForm.setStartDate(s);
      if (e) {
        setTimeout(() => bookingForm.setEndDate(e), 100);
      }
    }
  }, [searchParams]); // ✅ Only depend on searchParams, not bookingForm methods


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

    const timeoutId = setTimeout(fetchQuote, 500);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug, bookingForm.travellers]);

  // ⭐ NEW: Fetch Weather Risk Prediction when dates change
  useEffect(() => {
    // Only fetch if we have all required data
    if (!trekSlug || !bookingForm.startDate || !trek) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    const fetchRiskPrediction = async () => {
      setRiskLoading(true);
      setRiskError(null);
      setRiskAcknowledged(false); // Reset acknowledgment on date change

      try {
        // Extract elevation from max_altitude (e.g., "5,545m" -> 5545)
        const elevationStr = 
          trek.max_altitude || 
          trek.hero?.max_altitude || 
          bookingCardData?.max_altitude || 
          hero?.max_altitude || 
          '0m';
        
        const elevation = parseInt(
          elevationStr.replace(/,/g, '').replace(/m/g, '').trim(), 
          10
        ) || 5000; // Default fallback

        // Get latitude (add to trek data or use Nepal average)
        const latitude = trek.latitude || 27.99;

        console.log('🔍 Fetching risk prediction:', {
          trekSlug,
          latitude,
          elevation,
          dateStart: bookingForm.startDate,
          dateEnd: bookingForm.endDate || bookingForm.startDate
        });

        const prediction = await getTrekRiskPrediction({
          trekSlug,
          latitude,
          elevation,
          dateStart: bookingForm.startDate,
          dateEnd: bookingForm.endDate || bookingForm.startDate,
        });

        if (active && !controller.signal.aborted) {
          setRiskPrediction(prediction);
          console.log('✅ Risk prediction received:', prediction.overall_risk);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          console.error('❌ Failed to fetch risk prediction:', err);
          setRiskError(err.message || 'Weather prediction unavailable');
        }
      } finally {
        if (active) {
          setRiskLoading(false);
        }
      }
    };

    // Debounce to avoid excessive API calls when user is selecting dates
    const timeoutId = setTimeout(fetchRiskPrediction, 800);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug, bookingForm.startDate, bookingForm.endDate, trek, bookingCardData, hero]);

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

  // ⭐ UPDATED: Enhanced form submission with risk check
  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Check if high-risk conditions require acknowledgment
      const isDangerousConditions = 
        riskPrediction && 
        (riskPrediction.overall_risk === 'DANGER' || 
         riskPrediction.dangerous_days > 0);

      if (isDangerousConditions && !riskAcknowledged) {
        alert('Please acknowledge the weather risk warning before proceeding.');
        return;
      }

      // Proceed with normal booking
      bookingForm.handleBookingSubmit(
        e, 
        validation.formValid, 
        totalPrice, 
        trekSlug, 
        currency
      );
    },
    [
      bookingForm, 
      validation.formValid, 
      totalPrice, 
      trekSlug, 
      currency, 
      riskPrediction, 
      riskAcknowledged
    ]
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
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Unable to Start Booking
          </h2>
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
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
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

                {/* ⭐ NEW: Weather Risk Warning Component */}
                <WeatherRiskWarning
                  riskPrediction={riskPrediction}
                  riskLoading={riskLoading}
                  riskError={riskError}
                  riskAcknowledged={riskAcknowledged}
                  onAcknowledge={setRiskAcknowledged}
                  startDate={bookingForm.startDate}
                  endDate={bookingForm.endDate}
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
