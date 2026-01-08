import React from "react";
import { useSearchParams } from "react-router-dom";
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
import { useTrekBooking } from "../../hooks/useTrekBooking.js";

/**
 * Production-Ready Single Page Booking Form
 * Fetches real trek data from API and handles all edge cases
 */
export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const trekId = searchParams.get("trek_id") || "";

  // Fetch trek data from API using custom hook
  const { loading, error, data: trekBookingData } = useTrekBooking(trekId);

  // Extract data from API response
  const hero = trekBookingData?.hero;
  const trek = trekBookingData?.trek;
  const highlights = trekBookingData?.highlights || [];

  // Custom hooks for form management
  const bookingForm = useBookingForm(trek, hero);
  const validation = useFormValidation(
    bookingForm.lead,
    bookingForm.startDate,
    bookingForm.travellers,
    bookingForm.accepted
  );

  // ✅ Calculate pricing from REAL API data
  const basePrice = parseFloat(trek?.base_price || 0);
  const baseTotal = basePrice * bookingForm.travellers;
  const totalPrice = baseTotal;
  const initialPayment = +(totalPrice * 0.2).toFixed(2);
  const dueAmount = +(totalPrice - initialPayment).toFixed(2);

  // Loading state with professional spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-indigo-200 mx-auto"></div>
          </div>
          <p className="text-gray-700 text-lg font-semibold">
            Loading trek details...
          </p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error || !trekBookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trek Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load trek information"}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/treks")}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Browse All Treks
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Validate required data
  if (!hero || !trek || basePrice === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Trek Data
          </h2>
          <p className="text-gray-600 mb-6">
            This trek is missing required booking information. Please contact
            support.
          </p>
          <button
            onClick={() => (window.location.href = "/treks")}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Browse Other Treks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <BookingPageHero hero={hero} trek={trek} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={(e) =>
                bookingForm.handleSubmit(e, validation.formValid, totalPrice)
              }
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <FormHeader
                  title={`Book ${trek.name}`}
                  subtitle="Complete your booking in one simple form"
                />

                <TripDetailsSection
                  startDate={bookingForm.startDate}
                  setStartDate={bookingForm.setStartDate}
                  endDate={bookingForm.endDate}
                  travellers={bookingForm.travellers}
                  setTravellers={bookingForm.setTravellers}
                  duration={hero.duration}
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
                />
              </div>
            </form>
          </div>

          {/* Sidebar with REAL API data */}
          <PricingSidebar
            trek={trek}
            travellers={bookingForm.travellers}
            baseTotal={baseTotal}
            totalPrice={totalPrice}
            initialPayment={initialPayment}
            dueAmount={dueAmount}
            formatCurrency={bookingForm.formatCurrency}
            highlights={highlights}
          />
        </div>
      </div>
    </div>
  );
}
