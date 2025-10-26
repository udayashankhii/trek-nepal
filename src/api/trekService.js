// src/api/trekService.js
import axiosInstance from "./axiosInstance";

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

// Fetch single trek by slug (main detail)
export const fetchTrek = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/detail/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trek ${slug}:`, error);
    throw new Error("Failed to fetch trek details");
  }
};


// ============================================
// SECTION-SPECIFIC FETCHERS
// ============================================

export const fetchTrekOverview = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/overview/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek overview:", error);
    return null;
  }
};

export const fetchTrekHighlights = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/highlights/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek highlights:", error);
    return [];
  }
};

export const fetchTrekItinerary = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/itinerary/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek itinerary:", error);
    return [];
  }
};

export const fetchTrekCost = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/cost/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek cost:", error);
    return { inclusions: [], exclusions: [] };
  }
};

export const fetchTrekAction = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/action/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek actions:", error);
    return null;
  }
};

export const fetchTrekDepartures = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/departures/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek departures:", error);
    return [];
  }
};

// ============================================
// RELATED DATA FETCHERS
// ============================================

// Fetch similar treks
export const fetchSimilarTreks = async (slug, limit = 3) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/similar/?limit=${limit}`);
    const data = response.data;
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Error fetching similar treks:", error);
    return [];
  }
};

// Search treks
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
// COMPOSITE FETCHER (ALL DATA AT ONCE)
// ============================================

export const fetchCompleteTrekData = async (slug) => {
  try {
    const [
      mainData,
      overview,
      highlights,
      itinerary,
      cost,
      actions,
      departures,
      similar
    ] = await Promise.allSettled([
      fetchTrek(slug),
      fetchTrekOverview(slug),
      fetchTrekHighlights(slug),
      fetchTrekItinerary(slug),
      fetchTrekCost(slug),
      fetchTrekAction(slug),
      fetchTrekDepartures(slug),
      fetchSimilarTreks(slug, 3)
    ]);

    return {
      main: mainData.status === 'fulfilled' ? mainData.value : null,
      overview: overview.status === 'fulfilled' ? overview.value : null,
      highlights: highlights.status === 'fulfilled' ? highlights.value : [],
      itinerary: itinerary.status === 'fulfilled' ? itinerary.value : [],
      cost: cost.status === 'fulfilled' ? cost.value : { inclusions: [], exclusions: [] },
      actions: actions.status === 'fulfilled' ? actions.value : null,
      departures: departures.status === 'fulfilled' ? departures.value : [],
      similar: similar.status === 'fulfilled' ? similar.value : []
    };
  } catch (error) {
    console.error("Error fetching complete trek data:", error);
    throw error;
  }
};
