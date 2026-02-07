// src/components/BookingForm.jsx
import React, { useEffect } from "react";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  Plane,
} from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  InputField,
  SelectField,
  TextareaField,
  SectionContainer,
  TravellerCounter,
  SubmitButton,
} from "./FormComponents.jsx";


/**
 * ✅ Extract number of days from duration string
 */
function parseDurationDays(duration) {
  if (!duration) return null;
  const match = String(duration).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}


/**
 * ✅ Calculate end date from start date and duration (INCLUSIVE)
 * Example: 10-day trek starting Feb 8 → ends Feb 17
 * Formula: end = start + (days - 1)
 */
function calculateEndDate(startDateStr, durationDays) {
  if (!startDateStr || !durationDays) return "";

  try {
    // ✅ Use UTC midnight to prevent toISOString from shifting dates
    const start = new Date(startDateStr + "T00:00:00Z");
    if (isNaN(start.getTime())) return "";

    const end = new Date(start);
    // ✅ CORRECT: Subtract 1 for inclusive counting
    // 10-day trek: Day 1 (Feb 8) + 9 days = Day 10 (Feb 17)
    end.setUTCDate(start.getUTCDate() + durationDays - 1);

    return end.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error calculating end date:", error);
    return "";
  }
}


/**
 * ✅ Verify the calculation is correct (inclusive day count)
 * Returns the actual number of days between start and end (inclusive)
 */
function verifyDateRange(startDate, endDate) {
  if (!startDate || !endDate) return null;

  try {
    // ✅ Compare in UTC to ensure precisely 24h increments
    const start = new Date(startDate + "T00:00:00Z");
    const end = new Date(endDate + "T00:00:00Z");

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    // Calculate inclusive days: (end - start) + 1
    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  } catch (error) {
    console.error("Error verifying date range:", error);
    return null;
  }
}


/**
 * ✅ Format date for display
 */
function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  try {
    // ✅ Use UTC to display the correct day without timezone shifting
    return new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC" // ✅ CRITICAL: Force UTC display
    });
  } catch {
    return dateStr;
  }
}


/**
 * ✅ Form Header Component
 */
export function FormHeader({
  title = "Book Your Adventure",
  subtitle = "Complete your booking in one simple form",
}) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}


/**
 * ✅ UPDATED: Trip Details Section with Auto-calculated End Date
 */
export function TripDetailsSection({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  travellers,
  setTravellers,
  duration,
}) {
  const durationDays = parseDurationDays(duration);

  // ✅ Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (startDate && durationDays) {
      const calculatedEndDate = calculateEndDate(startDate, durationDays);
      if (calculatedEndDate && calculatedEndDate !== endDate) {
        setEndDate(calculatedEndDate);

        // ✅ Verify the calculation
        const actualDays = verifyDateRange(startDate, calculatedEndDate);
        console.log("📅 Date Calculation:", {
          startDate,
          endDate: calculatedEndDate,
          expectedDays: durationDays,
          actualDays,
          correct: actualDays === durationDays
        });
      }
    }
  }, [startDate, durationDays, endDate, setEndDate]);

  // Calculate actual trek days for display
  const actualTrekDays = startDate && endDate ? verifyDateRange(startDate, endDate) : null;

  return (
    <SectionContainer Icon={Calendar} title="Trek Details">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Departure Date"
          type="text"
          value={startDate ? formatDateDisplay(startDate) : ""}
          readOnly
          Icon={Calendar}
          helperText="Selected from departure dates"
        />
        <InputField
          label="Return Date"
          type="text"
          value={endDate ? formatDateDisplay(endDate) : ""}
          readOnly
          Icon={Calendar}
          helperText={
            durationDays
              ? `Auto-calculated (${durationDays} days inclusive)`
              : "Calculated from trek duration"
          }
        />
      </div>

      {/* ✅ Enhanced Duration Info Box with Verification */}
      {duration && startDate && endDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-900 mb-1">
                Trek Schedule
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Duration:</span> {duration}
                {actualTrekDays && durationDays && actualTrekDays !== durationDays && (
                  <span className="ml-2 text-red-600 font-semibold">
                    (⚠️ Mismatch: {actualTrekDays} days calculated)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Dates:</span>{" "}
                {formatDateDisplay(startDate)} → {formatDateDisplay(endDate)}
                {actualTrekDays && (
                  <span className="ml-2 text-indigo-600 font-medium">
                    ({actualTrekDays} days inclusive)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <TravellerCounter travellers={travellers} setTravellers={setTravellers} />
    </SectionContainer>
  );
}


/**
 * Personal Information Section - Contact and Details
 */
export function PersonalInfoSection({
  lead,
  changeLead,
  countryList,
  validation,
}) {
  const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr."];
  const experienceOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  return (
    <SectionContainer
      Icon={Users}
      title="Personal Information"
      gradientFrom="blue-50"
      gradientTo="indigo-50"
    >
      {/* Title and Experience */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <SelectField
          label="Title"
          name="title"
          value={lead.title}
          onChange={changeLead}
          options={titleOptions}
        />
        <SelectField
          label="Experience Level"
          name="experience"
          value={lead.experience}
          onChange={changeLead}
          options={experienceOptions}
        />
      </div>

      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="First Name"
          name="firstName"
          value={lead.firstName}
          onChange={changeLead}
          placeholder="Enter your first name"
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={lead.lastName}
          onChange={changeLead}
          placeholder="Enter your last name"
          required
        />
      </div>

      {/* Email and Phone */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={lead.email}
          onChange={changeLead}
          placeholder="your@email.com"
          required
          Icon={Mail}
          error={
            validation.showEmailError
              ? "Please enter a valid email address"
              : ""
          }
        />

        {/* ✅ Integrated React Phone Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Phone Number <span className="text-red-500 ml-1">*</span>
          </label>
          <PhoneInput
            country={'np'}
            value={lead.phone}
            onChange={(phone) => changeLead({ target: { name: 'phone', value: '+' + phone } })}
            enableSearch={true}
            disableSearchIcon={true}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: false,
            }}
            containerClass="!w-full"
            inputClass="!w-full !py-6 !pl-[48px] !border-2 !border-gray-200 !rounded-xl !text-base !font-sans !transition-colors focus:!border-indigo-500 focus:!ring-0"
            buttonClass="!border-2 !border-gray-200 !rounded-l-xl !bg-gray-50 !hover:bg-gray-100 !px-1"
            dropdownClass="!shadow-xl !rounded-xl !overflow-hidden"
            searchClass="!p-2 !border-b !border-gray-100"
          />
          {validation.showPhoneError && (
            <p className="text-sm text-red-500">Please enter a valid phone number</p>
          )}
        </div>
      </div>

      {/* Country */}
      <SelectField
        label="Country (Optional)"
        name="country"
        value={lead.country}
        onChange={changeLead}
        options={countryList.map((c) => ({ value: c.name, label: c.name }))}
        Icon={MapPin}
        placeholder="Select your country"
        className="mb-6"
      />

      {/* Emergency Contact */}
      <InputField
        label="Emergency Contact"
        name="emergencyContact"
        value={lead.emergencyContact}
        onChange={changeLead}
        placeholder="Name and phone number of emergency contact"
        className="mb-6"
      />

      {/* Dietary and Medical */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Dietary Requirements"
          name="dietaryReqs"
          value={lead.dietaryReqs}
          onChange={changeLead}
          placeholder="Vegetarian, allergies, etc."
        />
        <InputField
          label="Medical Conditions"
          name="medicalConditions"
          value={lead.medicalConditions}
          onChange={changeLead}
          placeholder="Any relevant medical information"
        />
      </div>
    </SectionContainer>
  );
}


/**
 * Additional Information Section - Special Requests
 */
export function AdditionalInfoSection({ preferences, changePreferences }) {
  return (
    <SectionContainer
      title="Additional Information"
      gradientFrom="green-50"
      gradientTo="emerald-50"
    >
      <TextareaField
        label="Special Requests"
        name="specialRequests"
        value={preferences.specialRequests}
        onChange={changePreferences}
        placeholder="Any special requests or additional information..."
        className="mb-6"
      />

      <TextareaField
        label="Comments or Questions"
        name="comments"
        value={preferences.comments || ""}
        onChange={(e) =>
          changePreferences({
            target: { name: "comments", value: e.target.value },
          })
        }
        placeholder="Any comments or questions you have about your trek..."
      />
    </SectionContainer>
  );
}


/**
 * Travel Times Section - Nepal Arrival/Departure
 */
/**
 * ✅ UPDATED: Travel Times Section - Nepal Arrival/Departure with Date & Time
 */
/**
 * ✅ SIMPLIFIED: Travel Times Section - Direct Nepal Time Input
 */
export function TravelTimesSection({
  departureTime,
  setDepartureTime,
  returnTime,
  setReturnTime,
}) {
  /**
   * Format datetime-local for display
   */
  const formatDateTime = (datetimeStr) => {
    if (!datetimeStr) return "";
    try {
      const date = new Date(datetimeStr);
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return datetimeStr;
    }
  };

  /**
   * Get minimum datetime (now)
   */
  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <SectionContainer
      Icon={Plane}
      title="Flight Information (Arrival & Departure)"
      gradientFrom="purple-50"
      gradientTo="pink-50"
      iconColor="purple-600"
      subtitle="Help us arrange airport transfers by providing your flight details"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Arrival in Nepal */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Arrival in Nepal 🛬
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              min={getMinDateTime()}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-700 font-medium"
            />
          </div>
          {departureTime && (
            <p className="text-xs text-purple-700 font-medium mt-2">
              📅 {formatDateTime(departureTime)}
            </p>
          )}
        </div>

        {/* Departure from Nepal */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Departure from Nepal 🛫
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              min={departureTime || getMinDateTime()}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-700 font-medium"
            />
          </div>
          {returnTime && (
            <p className="text-xs text-purple-700 font-medium mt-2">
              📅 {formatDateTime(returnTime)}
            </p>
          )}
        </div>
      </div>

      {/* Simple Info Note */}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <span className="font-semibold">Optional:</span> Share your flight times to help us coordinate airport pickup and drop-off services.
        </p>
      </div>
    </SectionContainer>
  );
}



/**
 * Terms and Submit Section
 */
export function TermsAndSubmitSection({
  accepted,
  setAccepted,
  formValid,
  submitting = false,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1 cursor-pointer"
            required
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
            I agree to the{" "}
            <a
              href="/terms-and-conditions"
              className="text-indigo-600 underline hover:text-indigo-800 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/about-us/privacy-policy"
              className="text-indigo-600 underline hover:text-indigo-800 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
      </div>

      <SubmitButton formValid={formValid} submitting={submitting} />
    </div>
  );
}