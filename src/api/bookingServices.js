// // src/api/bookingServices.js
// import { clearAuthTokens, getAccessToken } from "../api/auth.api.js";

// const API_BASE = import.meta.env.VITE_API_URL;

// // ============================================
// // UTILITIES
// // ============================================

// const buildUrl = (path) => {
//   const base = (API_BASE || "").replace(/\/+$/, "");
//   const suffix = path.startsWith("/") ? path : `/${path}`;
//   return `${base}${suffix}`;
// };

// const parseResponse = async (res) => {
//   let data = null;
//   try {
//     data = await res.json();
//   } catch (error) {
//     data = null;
//   }

//   if (res.status === 401) {
//     clearAuthTokens();
//     throw new Error("Session expired. Please log in again.");
//   }

//   if (!res.ok) {
//     const message = data?.detail || data?.error || data?.message || "Request failed";
//     throw new Error(message);
//   }

//   return data;
// };

// const makeAuthenticatedRequest = async (endpoint, options = {}) => {
//   const token = getAccessToken();
//   if (!token) {
//     throw new Error("Login required");
//   }

//   const res = await fetch(buildUrl(endpoint), {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...options.headers,
//     },
//     signal: options.signal,
//   });

//   return parseResponse(res);
// };

// // ============================================
// // SIMPLE CACHE FOR QUOTES
// // ============================================
// const quoteCache = new Map();
// const QUOTE_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// const getCachedQuote = (key) => {
//   const cached = quoteCache.get(key);
//   if (cached && Date.now() - cached.timestamp < QUOTE_CACHE_DURATION) {
//     return cached.data;
//   }
//   quoteCache.delete(key);
//   return null;
// };

// const setCachedQuote = (key, data) => {
//   quoteCache.set(key, { data, timestamp: Date.now() });
// };

// export const clearQuoteCache = () => {
//   quoteCache.clear();
// };

// // ============================================
// // BOOKING INTENT APIs
// // ============================================

// export const createBookingIntent = async ({ trekSlug, partySize = 1, email, phone, departure }, options = {}) => {
//   return makeAuthenticatedRequest(`/treks/${trekSlug}/booking-intents/`, {
//     method: "POST",
//     body: JSON.stringify({
//       party_size: partySize,
//       email,
//       phone,
//       departure,
//     }),
//     signal: options.signal,
//   });
// };

// export const getBookingIntent = async (intentId, options = {}) => {
//   return makeAuthenticatedRequest(`/booking-intents/${intentId}/`, {
//     signal: options.signal,
//   });
// };

// export const updateBookingIntent = async (intentId, updateData, options = {}) => {
//   return makeAuthenticatedRequest(`/booking-intents/${intentId}/`, {
//     method: "PATCH",
//     body: JSON.stringify(updateData),
//     signal: options.signal,
//   });
// };

// // ============================================
// // BOOKING QUOTE APIs
// // ============================================

// /**
//  * ✅ UPDATED: Get booking quote with graceful fallback
//  * Quote is optional - if not available, component will use base pricing
//  */
// export const getBookingQuote = async (
//   { trekSlug, partySize = 1, bookingIntent },
//   useCache = true,
//   options = {}
// ) => {
//   const cacheKey = `quote_${trekSlug}_${partySize}_${bookingIntent || "new"}`;

//   if (useCache) {
//     const cached = getCachedQuote(cacheKey);
//     if (cached) {
//       console.log("✅ Using cached quote");
//       return cached;
//     }
//   }

//   // List of possible quote endpoints to try
//   const endpoints = [
//     `/treks/${trekSlug}/quote/`,
//     `/bookings/quote/`,
//     `/treks/${trekSlug}/pricing/`,
//   ];

//   const requestBody = {
//     party_size: partySize,
//     ...(bookingIntent && { booking_intent: bookingIntent }),
//   };

//   // Try each endpoint
//   for (let i = 0; i < endpoints.length; i++) {
//     try {
//       const endpoint = endpoints[i];
//       console.log(`🔄 Trying quote endpoint: ${endpoint}`);

//       const data = await makeAuthenticatedRequest(endpoint, {
//         method: "POST",
//         body: JSON.stringify(
//           endpoint.includes("/bookings/quote/")
//             ? { trek_slug: trekSlug, ...requestBody }
//             : requestBody
//         ),
//         signal: options.signal,
//       });

//       console.log("✅ Quote fetched successfully from:", endpoint);
//       setCachedQuote(cacheKey, data);
//       return data;
//     } catch (error) {
//       console.warn(`⚠️ Quote endpoint ${endpoints[i]} failed:`, error.message);
      
//       // If it's the last endpoint and it failed, throw
//       if (i === endpoints.length - 1) {
//         throw new Error("Quote service unavailable - using base pricing");
//       }
//       // Otherwise continue to next endpoint
//     }
//   }
// };

// // ============================================
// // BOOKING CRUD APIs
// // ============================================

// export const createBooking = async (bookingData, options = {}) => {
//   return makeAuthenticatedRequest("/bookings/", {
//     method: "POST",
//     body: JSON.stringify({
//       trek_slug: bookingData.trekSlug,
//       booking_intent: bookingData.bookingIntent,
//       party_size: bookingData.partySize,
//       start_date: bookingData.startDate,
//       end_date: bookingData.endDate,
//       lead_name: bookingData.leadName,
//       lead_email: bookingData.leadEmail,
//       lead_phone: bookingData.leadPhone,
//       lead_title: bookingData.leadTitle,
//       lead_first_name: bookingData.leadFirstName,
//       lead_last_name: bookingData.leadLastName,
//       country: bookingData.country,
//       emergency_contact: bookingData.emergencyContact,
//       dietary_requirements: bookingData.dietaryRequirements,
//       medical_conditions: bookingData.medicalConditions,
//       experience_level: bookingData.experienceLevel,
//       guide_language: bookingData.guideLanguage,
//       special_requests: bookingData.specialRequests,
//       comments: bookingData.comments,
//       departure_time: bookingData.departureTime,
//       return_time: bookingData.returnTime,
//       total_amount: bookingData.totalAmount,
//       currency: bookingData.currency || "USD",
//       notes: bookingData.notes,
//       metadata: bookingData.metadata,
//     }),
//     signal: options.signal,
//   });
// };

// export const fetchBookingDetail = async (bookingRef, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/`, {
//     signal: options.signal,
//   });
// };

// export const fetchUserBookings = async (options = {}) => {
//   const data = await makeAuthenticatedRequest("/bookings/my-bookings/", {
//     signal: options.signal,
//   });
//   return data.results || data;
// };

// export const updateBooking = async (bookingRef, updateData, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/`, {
//     method: "PATCH",
//     body: JSON.stringify(updateData),
//     signal: options.signal,
//   });
// };

// export const cancelBooking = async (bookingRef, reason = "", options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/cancel/`, {
//     method: "POST",
//     body: JSON.stringify({ reason }),
//     signal: options.signal,
//   });
// };

// // ============================================
// // PAYMENT APIs
// // ============================================

// export const createPaymentIntent = async (bookingRef, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/payment-intent/`, {
//     method: "POST",
//     signal: options.signal,
//   });
// };

// export const markBookingPaid = async (bookingRef, paymentData = {}, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/mark-paid/`, {
//     method: "POST",
//     body: JSON.stringify(paymentData),
//     signal: options.signal,
//   });
// };

// export const verifyPayment = async (bookingRef, paymentData, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/verify-payment/`, {
//     method: "POST",
//     body: JSON.stringify(paymentData),
//     signal: options.signal,
//   });
// };

// export const saveBillingDetails = async (bookingRef, billing, options = {}) => {
//   return makeAuthenticatedRequest(`/bookings/${bookingRef}/billing-details/`, {
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

// // ============================================
// // AVAILABILITY APIs
// // ============================================

// export const checkAvailability = async (trekSlug, startDate, partySize = 1, options = {}) => {
//   const params = new URLSearchParams({
//     start_date: startDate,
//     party_size: partySize.toString(),
//   });
//   return makeAuthenticatedRequest(`/treks/${trekSlug}/availability/?${params}`, {
//     signal: options.signal,
//   });
// };

// export const getAvailableDates = async (trekSlug, year = null, month = null, options = {}) => {
//   const params = new URLSearchParams();
//   if (year) params.append("year", year.toString());
//   if (month) params.append("month", month.toString());
  
//   const queryString = params.toString();
//   const endpoint = `/treks/${trekSlug}/available-dates/${queryString ? `?${queryString}` : ""}`;
  
//   return makeAuthenticatedRequest(endpoint, {
//     signal: options.signal,
//   });
// };



// src/api/bookingServices.js
import { clearAuthTokens, getAccessToken } from "../api/auth.api.js";

const API_BASE = import.meta.env.VITE_API_URL;

// ✅ Add separate base URL for booking endpoints
const BOOKING_API_BASE = `${API_BASE}/api`;

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
    const message = data?.detail || data?.error || data?.message || "Request failed";
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

export const createBookingIntent = async ({ trekSlug, partySize = 1, email, phone, departure }, options = {}) => {
  return makeBookingRequest(`/treks/${trekSlug}/booking-intents/`, {
    method: "POST",
    body: JSON.stringify({
      party_size: partySize,
      email,
      phone,
      departure,
    }),
    signal: options.signal,
  });
};

export const getBookingIntent = async (intentId, options = {}) => {
  return makeBookingRequest(`/booking-intents/${intentId}/`, {
    signal: options.signal,
  });
};

export const updateBookingIntent = async (intentId, updateData, options = {}) => {
  return makeBookingRequest(`/booking-intents/${intentId}/`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    signal: options.signal,
  });
};

// ============================================
// BOOKING QUOTE APIs - ✅ UPDATED
// ============================================

export const getBookingQuote = async (
  { trekSlug, partySize = 1, bookingIntent },
  useCache = true,
  options = {}
) => {
  const cacheKey = `quote_${trekSlug}_${partySize}_${bookingIntent || "new"}`;

  if (useCache) {
    const cached = getCachedQuote(cacheKey);
    if (cached) {
      console.log("✅ Using cached quote");
      return cached;
    }
  }

  const endpoints = [
    `/treks/${trekSlug}/quote/`,
    `/bookings/quote/`,
    `/treks/${trekSlug}/pricing/`,
  ];

  const requestBody = {
    party_size: partySize,
    ...(bookingIntent && { booking_intent: bookingIntent }),
  };

  for (let i = 0; i < endpoints.length; i++) {
    try {
      const endpoint = endpoints[i];
      console.log(`🔄 Trying quote endpoint: ${endpoint}`);

      const data = await makeBookingRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(
          endpoint.includes("/bookings/quote/")
            ? { trek_slug: trekSlug, ...requestBody }
            : requestBody
        ),
        signal: options.signal,
      });

      console.log("✅ Quote fetched successfully from:", endpoint);
      setCachedQuote(cacheKey, data);
      return data;
    } catch (error) {
      console.warn(`⚠️ Quote endpoint ${endpoints[i]} failed:`, error.message);
      
      if (i === endpoints.length - 1) {
        throw new Error("Quote service unavailable - using base pricing");
      }
    }
  }
};

// ============================================
// BOOKING CRUD APIs - ✅ UPDATED
// ============================================

export const createBooking = async (bookingData, options = {}) => {
  return makeBookingRequest("/bookings/", {
    method: "POST",
    body: JSON.stringify({
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
      total_amount: bookingData.totalAmount,
      currency: bookingData.currency || "USD",
      notes: bookingData.notes,
      metadata: bookingData.metadata,
    }),
    signal: options.signal,
  });
};

export const fetchBookingDetail = async (bookingRef, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/`, {
    signal: options.signal,
  });
};

export const fetchUserBookings = async (options = {}) => {
  const data = await makeBookingRequest("/bookings/my-bookings/", {
    signal: options.signal,
  });
  return data.results || data;
};

export const updateBooking = async (bookingRef, updateData, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    signal: options.signal,
  });
};

export const cancelBooking = async (bookingRef, reason = "", options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/cancel/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
    signal: options.signal,
  });
};

// ============================================
// PAYMENT APIs - ✅ UPDATED
// ============================================

export const createPaymentIntent = async (bookingRef, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/payment-intent/`, {
    method: "POST",
    signal: options.signal,
  });
};

export const markBookingPaid = async (bookingRef, paymentData = {}, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/mark-paid/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
    signal: options.signal,
  });
};

export const verifyPayment = async (bookingRef, paymentData, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/verify-payment/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
    signal: options.signal,
  });
};

export const saveBillingDetails = async (bookingRef, billing, options = {}) => {
  return makeBookingRequest(`/bookings/${bookingRef}/billing-details/`, {
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
  return makeAuthenticatedRequest(`/treks/${trekSlug}/availability/?${params}`, {
    signal: options.signal,
  });
};

export const getAvailableDates = async (trekSlug, year = null, month = null, options = {}) => {
  const params = new URLSearchParams();
  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());
  
  const queryString = params.toString();
  const endpoint = `/treks/${trekSlug}/available-dates/${queryString ? `?${queryString}` : ""}`;
  
  return makeAuthenticatedRequest(endpoint, {
    signal: options.signal,
  });
};
