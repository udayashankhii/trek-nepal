// src/api/trekService.js
import axiosInstance from "./axiosInstance";



const convertToSlug = async (trekId) => {
  // Check if it's already a slug (has letters, not just UUID format)
  if (trekId.includes("-") && trekId.length > 35) {
    // It's a UUID, need to convert
    const response = await axiosInstance.get("treks/");
    const treks = response.data.results || response.data;
    const trek = treks.find(t => t.public_id === trekId);
    if (!trek) throw new Error("Trek not found");
    return trek.slug;
  }
  // Already a slug
  return trekId;
};

// ============================================
// MAIN TREK DATA FETCHERS
// ============================================

// Fetch all treks
export const fetchAllTreks = async () => {
  try {
    const response = await axiosInstance.get("treks/");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
    console.warn("Unexpected trek API response format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching all treks:", error);
    return [];
  }
};

// Fetch single trek by slug - USES YOUR ACTUAL ENDPOINT
export const fetchTrek = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/detail/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek:", error);
    throw error;
  }
};

// ============================================
// SECTION-SPECIFIC FETCHERS (YOUR ACTUAL ENDPOINTS)
// ============================================

export const fetchTrekKeyInfo = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/key-info/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek key info:", error);
    return null;
  }
};

export const fetchTrekOverview = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/overview/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek overview:", error);
    return null;
  }
};

export const fetchTrekHighlights = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/highlights/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek highlights:", error);
    return [];
  }
};

export const fetchTrekItinerary = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/itinerary/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek itinerary:", error);
    return [];
  }
};

export const fetchTrekCosts = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/costs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek costs:", error);
    return { inclusions: [], exclusions: [] };
  }
};

export const fetchTrekActions = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/actions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek actions:", error);
    return null;
  }
};

export const fetchTrekCostDates = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/cost-dates/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek cost dates:", error);
    return [];
  }
};

export const fetchTrekReviews = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/reviews/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek reviews:", error);
    return { trek: null, count: 0, results: [] };
  }
};

export const fetchTrekBookingCard = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/booking-card/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek booking card:", error);
    return null;
  }
};

export const fetchTrekGallery = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/gallery/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek gallery:", error);
    return [];
  }
};

export const fetchTrekHero = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/hero/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek hero:", error);
    return null;
  }
};

export const fetchTrekElevationChart = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/elevation-chart/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek elevation chart:", error);
    return null;
  }
};

export const fetchTrekAdditionalInfo = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/additional-info/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek additional info:", error);
    return null;
  }
};

export const fetchSimilarTreks = async (trekSlug, limit = 3) => {
  try {
    const response = await axiosInstance.get(
      `treks/${trekSlug}/similar/?limit=${limit}`
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Error fetching similar treks:", error);
    return [];
  }
};

export const searchTreks = async (query = "", filters = {}) => {
  try {
    const params = { q: query, ...filters };
    const response = await axiosInstance.get("treks/search/", { params });
    const data = response.data;
    return Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error("Error searching treks:", err);
    return [];
  }
};

// ============================================
// BOOKING-SPECIFIC FETCHER (USES REAL ENDPOINTS)
// ============================================

/**
 * ✅ PRODUCTION READY: Fetch trek data for booking page
 * Uses YOUR ACTUAL backend endpoints
 * @param {string} trekSlug - Trek slug (e.g., "everest-base-camp-trek")
 * @returns {Promise<Object>} Normalized booking data
 */
export const fetchTrekBookingData = async (trekId) => {
  try {
    // Convert UUID to slug
    const slug = await convertToSlug(trekId);
    
    // Fetch data using slug
    const [detail, highlights, hero, bookingCard] = await Promise.all([
      axiosInstance.get(`treks/${slug}/detail/`).catch(() => null),
      axiosInstance.get(`treks/${slug}/highlights/`).catch(() => []),
      axiosInstance.get(`treks/${slug}/hero/`).catch(() => null),
      axiosInstance.get(`treks/${slug}/booking-card/`).catch(() => null),
    ]);

    const trek = detail?.data?.trek || detail?.data || {};
    const heroData = hero?.data || {};
    const booking = bookingCard?.data || {};
    const highlightsList = highlights?.data || [];

    return {
      hero: {
        title: heroData.title || trek.title || "Unknown Trek",
        subtitle: heroData.subtitle || `Experience ${trek.region_name || ""}`,
        imageUrl: heroData.imageUrl || trek.card_image_url || "",
        duration: heroData.duration || trek.duration || "N/A",
        difficulty: heroData.difficulty || trek.trip_grade || "Moderate",
        location: heroData.location || trek.region_name || "",
      },
      trek: {
        id: trek.public_id || trek.id,
        slug: slug,
        name: trek.title,
        title: trek.title,
        rating: trek.rating || 0,
        reviews: trek.reviews || 0,
        base_price: booking.base_price || 0,
        currency: booking.currency || "USD",
      },
      highlights: highlightsList,
      booking: booking,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// ============================================
// COMPOSITE FETCHER (ALL DATA AT ONCE)
// ============================================

export const fetchCompleteTrekData = async (trekSlug) => {
  try {
    const [
      detail,
      overview,
      highlights,
      itinerary,
      costs,
      actions,
      costDates,
      similar,
      hero,
    ] = await Promise.allSettled([
      fetchTrek(trekSlug),
      fetchTrekOverview(trekSlug),
      fetchTrekHighlights(trekSlug),
      fetchTrekItinerary(trekSlug),
      fetchTrekCosts(trekSlug),
      fetchTrekActions(trekSlug),
      fetchTrekCostDates(trekSlug),
      fetchSimilarTreks(trekSlug, 3),
      fetchTrekHero(trekSlug),
    ]);

    return {
      detail: detail.status === "fulfilled" ? detail.value : null,
      overview: overview.status === "fulfilled" ? overview.value : null,
      highlights: highlights.status === "fulfilled" ? highlights.value : [],
      itinerary: itinerary.status === "fulfilled" ? itinerary.value : [],
      costs: costs.status === "fulfilled" ? costs.value : { inclusions: [], exclusions: [] },
      actions: actions.status === "fulfilled" ? actions.value : null,
      costDates: costDates.status === "fulfilled" ? costDates.value : [],
      similar: similar.status === "fulfilled" ? similar.value : [],
      hero: hero.status === "fulfilled" ? hero.value : null,
    };
  } catch (error) {
    console.error("Error fetching complete trek data:", error);
    throw error;
  }
};

// ============================================
// BOOKING INTENT API (FOR ACTUAL BOOKING SUBMISSION)
// ============================================

/**
 * Create booking intent
 * @param {Object} bookingData - Booking form data
 * @returns {Promise<Object>} Booking intent response
 */
export const createBookingIntent = async (trekSlug, bookingData) => {
  try {
    const response = await axiosInstance.post(
      `treks/${trekSlug}/booking-intents/`,
      bookingData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating booking intent:", error);
    throw error;
  }
};

/**
 * Get booking intent details
 * @param {string} bookingId - Booking intent UUID
 * @returns {Promise<Object>} Booking intent details
 */
export const getBookingIntent = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`booking-intents/${bookingId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking intent:", error);
    throw error;
  }
};

/**
 * Update booking intent
 * @param {string} bookingId - Booking intent UUID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated booking intent
 */
export const updateBookingIntent = async (bookingId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `booking-intents/${bookingId}/update/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking intent:", error);
    throw error;
  }
};
