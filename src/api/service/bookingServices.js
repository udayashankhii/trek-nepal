

// src/api/bookingServices.js
import { clearAuthTokens, getAccessToken } from "../auth/auth.api.js";

const API_BASE = import.meta.env.VITE_API_URL;
// ✅ Add separate base URL for booking endpoints
const BOOKING_API_BASE = `${API_BASE}/api/bookings`;

// ============================================
// UTILITIES
// ============================================

const buildUrl = (path) => {
  const base = (API_BASE || "").replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

// ✅ NEW: Build URL specifically for booking endpoints
const buildBookingUrl = (path) => {
  const base = (BOOKING_API_BASE || "").replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

const parseResponse = async (res) => {
  let data = null;
  try {
    data = await res.json();
  } catch (error) {
    data = null;
  }

  if (res.status === 401) {
    clearAuthTokens();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    // Handle DRF validation errors (usually an object with field-specific errors)
    let message = "Request failed";

    if (data) {
      if (data.detail) {
        message = data.detail;
      } else if (data.error) {
        message = data.error;
      } else if (data.message) {
        message = data.message;
      } else if (typeof data === "object") {
        // DRF returns validation errors as { field_name: ["error message"] }
        const errors = Object.entries(data)
          .map(([field, msgs]) => {
            const errorMsgs = Array.isArray(msgs) ? msgs.join(", ") : msgs;
            return `${field}: ${errorMsgs}`;
          })
          .join("; ");
        message = errors || "Validation failed";
      }
    }

    console.error("❌ API Error:", res.status, data);
    throw new Error(message);
  }

  return data;
};

const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    signal: options.signal,
  });

  return parseResponse(res);
};

// ✅ NEW: Make authenticated request for booking endpoints
const makeBookingRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildBookingUrl(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    signal: options.signal,
  });

  return parseResponse(res);
};

// ============================================
// SIMPLE CACHE FOR QUOTES
// ============================================
const quoteCache = new Map();
const QUOTE_CACHE_DURATION = 2 * 60 * 1000;

const getCachedQuote = (key) => {
  const cached = quoteCache.get(key);
  if (cached && Date.now() - cached.timestamp < QUOTE_CACHE_DURATION) {
    return cached.data;
  }
  quoteCache.delete(key);
  return null;
};

const setCachedQuote = (key, data) => {
  quoteCache.set(key, { data, timestamp: Date.now() });
};

export const clearQuoteCache = () => {
  quoteCache.clear();
};

// ============================================
// BOOKING INTENT APIs - ✅ UPDATED TO USE makeBookingRequest
// ============================================




export const createBookingIntent = async ({ trekSlug, partySize = 1, email, phone, departure }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/treks/${trekSlug}/booking-intents/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      party_size: partySize,
      email,
      phone,
      departure,
    }),
  });

  return parseResponse(res);
};



// ============================================
// BOOKING QUOTE APIs - ✅ UPDATED
// ============================================

// ✅ FIXED: Single endpoint, proper return
export const getBookingQuote = async ({ trekSlug, partySize = 1, bookingIntent }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl("/api/bookings/quote/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      trek_slug: trekSlug,
      party_size: partySize,
      booking_intent: bookingIntent,
    }),
  });

  return parseResponse(res);
};


// ============================================
// BOOKING CRUD APIs - ✅ UPDATED
// ============================================

// ✅ FIXED: Use correct path (no leading slash needed)

// src/api/bookingServices.js

/**
 * STEP 1: Create booking intent

/**
 * STEP 2: Create booking (STRICT serializer-compliant payload)
 */
// export async function createBooking(payload) {
//   const res = await api.post("/bookings/", payload);
//   return res.data;
// }

/**
 * STEP 4: Fetch booking detail
 */
export const fetchBookingDetail = async ({ bookingRef }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
};


//  * Fetch all bookings for the authenticated user
//  */
export async function fetchUserBookings(options = {}) {
  return makeBookingRequest("/", {
    signal: options.signal,
  });
}

/**
 * STEP 5: Create Stripe PaymentIntent
 */
export const createPaymentIntent = async ({ bookingRef }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/payment-intent/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
};



/**
 * STEP 6: Save billing details
 */
export const saveBillingDetails = async ({ bookingRef, billing }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/billing-details/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: billing.name,
      email: billing.email,
      phone: billing.phone,
      address_line1: billing.address1,
      address_line2: billing.address2,
      city: billing.city,
      state: billing.state,
      postal_code: billing.postalCode,
      country: billing.country,
    }),
  });

  return parseResponse(res);
};
/**
 * STEP 7: Mark booking paid (DEV / webhook fallback)
 */
export const markBookingPaid = async ({ bookingRef }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/mark-paid/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
};



export const verifyPayment = async (bookingRef, paymentData, options = {}) => {
  return makeBookingRequest(`/${bookingRef}/verify-payment/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
    signal: options.signal,
  });
};



// ============================================
// AVAILABILITY APIs - Keep using makeAuthenticatedRequest (TrekCard endpoints)
// ============================================

export const checkAvailability = async (trekSlug, startDate, partySize = 1, options = {}) => {
  const params = new URLSearchParams({
    start_date: startDate,
    party_size: partySize.toString(),
  });
  // ✅ FIX: Add /api/ prefix
  return makeAuthenticatedRequest(`/api/treks/${trekSlug}/availability/?${params}`, {
    signal: options.signal,
  });
};
export const getAvailableDates = async (trekSlug, year = null, month = null, options = {}) => {
  const params = new URLSearchParams();
  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());

  const queryString = params.toString();
  // ✅ FIX: Add /api/ prefix
  const endpoint = `/api/treks/${trekSlug}/available-dates/${queryString ? `?${queryString}` : ""}`;

  return makeAuthenticatedRequest(endpoint, {
    signal: options.signal,
  });
};

export const completePaymentIntent = async ({ bookingRef, paymentIntentId }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/finalize-payment/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      payment_intent_id: paymentIntentId,
    }),
  });

  return parseResponse(res);
};

export const createCheckoutSession = async ({ bookingRef }) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl(`/api/bookings/${bookingRef}/checkout-session/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
};

export const createBooking = async ({
  trekSlug,
  bookingIntent,
  partySize,
  startDate,
  endDate,
  leadName,
  leadEmail,
  leadPhone,
  leadTitle,
  leadFirstName,
  leadLastName,
  country,
  emergencyContact,
  dietaryRequirements,
  medicalConditions,
  experienceLevel,
  guideLanguage,
  specialRequests,
  comments,
  departureTime,
  returnTime,
  totalAmount,
  currency = "USD",
  notes,
  metadata,
}) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const res = await fetch(buildUrl("/api/bookings/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      trek_slug: trekSlug,
      booking_intent: bookingIntent,
      party_size: partySize,
      start_date: startDate,
      end_date: endDate,
      lead_name: leadName,
      lead_email: leadEmail,
      lead_phone: leadPhone,
      lead_title: leadTitle,
      lead_first_name: leadFirstName,
      lead_last_name: leadLastName,
      country,
      emergency_contact: emergencyContact,
      dietary_requirements: dietaryRequirements,
      medical_conditions: medicalConditions,
      experience_level: experienceLevel,
      guide_language: guideLanguage,
      special_requests: specialRequests,
      comments,
      departure_time: departureTime,
      return_time: returnTime,
      total_amount: totalAmount,
      currency,
      notes,
      metadata,
    }),
  });

  return parseResponse(res);
};
