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
import WeatherRiskWarning from "./WeatherRiskWarning.jsx";
import { getBookingQuote } from "../../api/service/bookingServices.js";
import { getTrekRiskByItinerary } from "../../api/service/trekRisk.js";

import { useBookingForm } from "../../hooks/useBookingForm.js";
import { useFormValidation } from "../../hooks/useFormValidation.js";
import { fetchTrekBookingData } from "../../api/service/trekService.js";

/**
 * ✅ Check if trek dates are within weather forecast range (16 days)
 */
function checkWeatherForecastAvailability(startDate, durationDays) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  const lastTrekDay = new Date(start);
  lastTrekDay.setDate(start.getDate() + durationDays - 1);
  
  const maxForecastDate = new Date(today);
  maxForecastDate.setDate(today.getDate() + 16);
  
  const isWithinRange = lastTrekDay <= maxForecastDate;
  const daysOutOfRange = Math.ceil((lastTrekDay - maxForecastDate) / (1000 * 60 * 60 * 24));
  
  return {
    isWithinRange,
    daysOutOfRange: Math.max(0, daysOutOfRange),
    lastTrekDate: lastTrekDay.toISOString().split('T')[0],
    maxForecastDate: maxForecastDate.toISOString().split('T')[0]
  };
}

export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get trek slug from URL params
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

  // Hooks
  const bookingForm = useBookingForm(trek, hero);
  const validation = useFormValidation(
    bookingForm.lead,
    bookingForm.startDate,
    bookingForm.travellers,
    bookingForm.accepted
  );

  // Weather Risk Prediction State
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState(null);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);

  // Quote State
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // ✅ Initialize dates from URL params
  useEffect(() => {
    const s = searchParams.get("startDate") || searchParams.get("date");

    console.log("📅 Initializing start date from URL:", { startDate: s });

    if (s && s !== "null" && s !== "undefined") {
      bookingForm.setStartDate(s);
    }
  }, [searchParams]);

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

        console.log("📦 Trek data loaded:", {
          name: result.trek?.name,
          hasItineraryDays: !!result.trek?.itinerary_days,
          hasItinerary: !!result.trek?.itinerary,
          itineraryLength:
            result.trek?.itinerary_days?.length ||
            result.trek?.itinerary?.length,
        });

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

  // ✅ Fetch Weather Risk Prediction with 16-day validation
  useEffect(() => {
    if (!trekSlug || !bookingForm.startDate || !trek) {
      console.log("⚠️ Waiting for trek data...", {
        hasTrekSlug: !!trekSlug,
        hasStartDate: !!bookingForm.startDate,
        hasTrek: !!trek,
      });
      return;
    }

    let active = true;
    const controller = new AbortController();

    const fetchRiskPrediction = async () => {
      const itineraryData = trek?.itinerary_days || trek?.itinerary;

      if (!itineraryData || itineraryData.length === 0) {
        console.log("⚠️ No itinerary data available");
        setRiskError("Trek itinerary data not available");
        return;
      }

      // ✅ NEW: Check if dates are within 16-day forecast window
      const forecastCheck = checkWeatherForecastAvailability(
        bookingForm.startDate,
        itineraryData.length
      );

      if (!forecastCheck.isWithinRange) {
        console.log("⚠️ Trek dates beyond 16-day forecast range:", {
          startDate: bookingForm.startDate,
          lastTrekDate: forecastCheck.lastTrekDate,
          daysOutOfRange: forecastCheck.daysOutOfRange,
        });

        const endDateFormatted = new Date(forecastCheck.lastTrekDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        setRiskError(
          `Weather forecasts are only available for the next 16 days `
        );
        return;
      }

      setRiskLoading(true);
      setRiskError(null);
      setRiskAcknowledged(false);

      try {
        console.log("🔍 Fetching day-by-day weather predictions:", {
          trekSlug,
          startDate: bookingForm.startDate,
          itineraryLength: itineraryData.length,
          withinForecastWindow: true,
        });

        const prediction = await getTrekRiskByItinerary({
          trekSlug: trek.slug || trekSlug,
          itineraryDays: itineraryData,
          startDate: bookingForm.startDate,
        });

        if (active && !controller.signal.aborted) {
          setRiskPrediction(prediction);
          console.log("✅ Risk prediction received:", prediction.overall_risk);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          console.error("❌ Failed to fetch risk prediction:", err);
          setRiskError(err.message || "Weather prediction unavailable");
        }
      } finally {
        if (active) {
          setRiskLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchRiskPrediction, 800);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [trekSlug, bookingForm.startDate, trek]);

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
  const initialPayment = +(totalPrice * 0.2).toFixed(2);
  const dueAmount = +(totalPrice - initialPayment).toFixed(2);
  const currency = quote?.currency || trek?.currency || "USD";

  // ✅ Enhanced form submission with risk check
  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const isDangerousConditions =
        riskPrediction &&
        (riskPrediction.overall_risk === "DANGER" ||
          riskPrediction.dangerous_days > 0);

      if (isDangerousConditions && !riskAcknowledged) {
        alert("Please acknowledge the weather risk warning before proceeding.");
        return;
      }

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
      riskAcknowledged,
    ]
  );

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
          <div className="lg:col-span-2">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <FormHeader
                  title={`Book ${trek.name || trek.title || "Your Trek"}`}
                  subtitle="Complete your booking in one simple form"
                />

    

{/* // Pass departures to TripDetailsSection */}
<TripDetailsSection
  startDate={bookingForm.startDate}
  setStartDate={bookingForm.setStartDate}
  endDate={bookingForm.endDate}
  setEndDate={bookingForm.setEndDate}
  travellers={bookingForm.travellers}
  setTravellers={bookingForm.setTravellers}
  duration={hero?.duration || trek.duration || "N/A"}
  departures={trek?.departures || []} // ✅ NEW: Pass departures from API
  handleDepartureSelect={bookingForm.handleDepartureSelect} // ✅ NEW
  selectedDeparture={bookingForm.selectedDeparture} // ✅ NEW
/>


                <WeatherRiskWarning
                  riskPrediction={riskPrediction}
                  riskLoading={riskLoading}
                  riskError={riskError}
                  itineraryDays={trek?.itinerary_days || trek?.itinerary}
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

  



