

// src/api/bookingServices.js
import { clearAuthTokens, getAccessToken } from "../api/auth.api.js";

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

export const createBookingIntent = async (
  { trekSlug, partySize = 1, email, phone },
  options = {}
) => {
  // ✅ FIX: Add /api/ prefix
  return makeAuthenticatedRequest(`/api/treks/${trekSlug}/booking-intents/`, {
    method: "POST",
    body: JSON.stringify({
      party_size: partySize,
      email,
      phone,
    }),
    signal: options.signal,
  });
};


export const getBookingIntent = async (intentId, options = {}) => {
  // ✅ FIX: Add /api/ prefix
  return makeAuthenticatedRequest(`/api/booking-intents/${intentId}/`, {
    signal: options.signal,
  });
};

export const updateBookingIntent = async (intentId, updateData, options = {}) => {
  // ✅ FIX: Add /api/ prefix
  return makeAuthenticatedRequest(`/api/booking-intents/${intentId}/`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    signal: options.signal,
  });
};

// ============================================
// BOOKING QUOTE APIs - ✅ UPDATED
// ============================================

// ✅ FIXED: Single endpoint, proper return
export const getBookingQuote = async (
  { trekSlug, partySize = 1, bookingIntent },
  useCache = true,
  options = {}
) => {
  const cacheKey = `quote_${trekSlug}_${partySize}_${bookingIntent || "new"}`;

  // Check cache
  if (useCache) {
    const cached = getCachedQuote(cacheKey);
    if (cached) {
      console.log("✅ Using cached quote");
      return cached;
    }
  }

  // ✅ SINGLE endpoint - no fallbacks
  const endpoint = `/quote/`;  // Becomes /api/bookings/quote/
  
  const requestBody = {
    trek_slug: trekSlug,
    party_size: partySize,
    ...(bookingIntent && { booking_intent: bookingIntent }),
  };

  console.log(`🔄 Fetching quote from: ${endpoint}`, requestBody);

  try {
    const data = await makeBookingRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      signal: options.signal,
    });

    console.log("✅ Quote received:", data);
    
    // ✅ Cache and RETURN
    setCachedQuote(cacheKey, data);
    return data;  // ✅ FIX: Return the data!

  } catch (error) {
    console.error("❌ Quote fetch failed:", error.message);
    
    // ✅ Return safe fallback object
    return {
      trek_slug: trekSlug,
      party_size: partySize,
      currency: "USD",
      unit_price: null,
      total_amount: null,
      error: error.message,
    };
  }
};


// ============================================
// BOOKING CRUD APIs - ✅ UPDATED
// ============================================

// ✅ FIXED: Use correct path (no leading slash needed)
export const createBooking = async (bookingData, options = {}) => {
  const payload = {
    trek_slug: bookingData.trekSlug,
    booking_intent: bookingData.bookingIntent,
    party_size: bookingData.partySize,
    start_date: bookingData.startDate,
    end_date: bookingData.endDate,
    lead_name: bookingData.leadName,
    lead_email: bookingData.leadEmail,
    lead_phone: bookingData.leadPhone,
    lead_title: bookingData.leadTitle,
    lead_first_name: bookingData.leadFirstName,
    lead_last_name: bookingData.leadLastName,
    country: bookingData.country,
    emergency_contact: bookingData.emergencyContact,
    dietary_requirements: bookingData.dietaryRequirements,
    medical_conditions: bookingData.medicalConditions,
    experience_level: bookingData.experienceLevel,
    guide_language: bookingData.guideLanguage,
    special_requests: bookingData.specialRequests,
    comments: bookingData.comments,
    departure_time: bookingData.departureTime,
    return_time: bookingData.returnTime,
    currency: bookingData.currency || "USD",
    notes: bookingData.notes,
    metadata: bookingData.metadata,
  };

  // Don't send total_amount - let backend calculate it
  if (bookingData.totalAmount !== undefined && bookingData.totalAmount !== null) {
    payload.total_amount = bookingData.totalAmount;
  }

  // ✅ Use empty path - buildBookingUrl will make it /api/bookings/
  return makeBookingRequest("/", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options.signal,
  });
};
// src/api/bookingServices.js

/**
 * STEP 1: Create booking intent
 */
// export async function createBookingIntent({ trekSlug, partySize }) {
//   const res = await api.post(
//     `/treks/${trekSlug}/booking-intents/`,
//     { party_size: partySize }
//   );
//   return res.data; // { booking_id: UUID }
// }

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
export async function fetchBookingDetail(bookingRef) {
  return makeBookingRequest(`/${bookingRef}/`);
}

/**
 * Fetch all bookings for the authenticated user
 */
export async function fetchUserBookings(options = {}) {
  return makeBookingRequest("/", {
    signal: options.signal,
  });
}

/**
 * STEP 5: Create Stripe PaymentIntent
 */
export async function createPaymentIntent(bookingRef) {
  return makeBookingRequest(`/${bookingRef}/payment-intent/`, {
    method: "POST",
  });
}

/**
 * STEP 6: Save billing details
 */
export async function saveBillingDetails(bookingRef, billing) {
  return makeBookingRequest(`/${bookingRef}/billing-details/`, {
    method: "POST",
    body: JSON.stringify({
      name: billing.name,
      email: billing.email,
      phone: billing.phone,
      address_line1: billing.address1 || billing.addressLine1,
      address_line2: billing.address2 || billing.addressLine2,
      city: billing.city,
      state: billing.state,
      postal_code: billing.postalCode || billing.postal_code,
      country: billing.country,
    }),
  });
}

/**
 * STEP 7: Mark booking paid (DEV / webhook fallback)
 */
export async function markBookingPaid(bookingRef) {
  return makeBookingRequest(`/${bookingRef}/mark-paid/`, {
    method: "POST",
  });
}


export const verifyPayment = async (bookingRef, paymentData, options = {}) => {
  return makeBookingRequest(`/${bookingRef}/verify-payment/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
    signal: options.signal,
  });
};

// export const saveBillingDetails = async (bookingRef, billing, options = {}) => {
//   return makeBookingRequest(`/bookings/${bookingRef}/billing-details/`, {
//     method: "POST",
//     body: JSON.stringify({
//       name: billing.name,
//       email: billing.email,
//       phone: billing.phone,
//       address_line1: billing.address1 || billing.addressLine1,
//       address_line2: billing.address2 || billing.addressLine2,
//       city: billing.city,
//       state: billing.state,
//       postal_code: billing.postalCode || billing.postal_code,
//       country: billing.country,
//     }),
//     signal: options.signal,
//   });
// };

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