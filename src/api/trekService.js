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

// Fetch trek reviews
export const fetchTrekReviews = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/reviews/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek reviews:", error);
    return { trek: null, count: 0, results: [] };
  }
};

// Fetch trek booking card data
export const fetchTrekBookingCard = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/booking-card/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek booking card:", error);
    return null;
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



export const fetchTrekElevationChart = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/elevation-chart/`);
    return response.data;
  } catch (error) {
    return null;
  }
};


export const fetchTrekHero = async (slug) => {
  try {
    const response = await axiosInstance.get(`http://localhost:5173/trek-booking?trek_id=everest-base-camp-trek
/${slug}/hero/`);
    const data = response.data || {};

    const heroData = data.hero || {};
    const trekData = data.trek || {};

    return {
      hero: {
        title: heroData.title || trekData.title || "Unknown Trek",
        subtitle: heroData.subtitle || "",
        imageUrl:
          heroData.imageUrl ||
          trekData.card_image_url ||
          "/images/default-hero.jpg",
        duration: heroData.duration || trekData.duration || "N/A",
        difficulty: heroData.difficulty || trekData.trip_grade || "N/A",
        location: heroData.location || trekData.region_name || "",
      },
      trek: {
        rating: trekData.rating || 0,
        reviews: trekData.reviews || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching trek hero:", error);
    // Return a default structure to avoid breaking frontend
    return {
      hero: {
        title: "Unknown Trek",
        subtitle: "",
        imageUrl: "/images/default-hero.jpg",
        duration: "N/A",
        difficulty: "N/A",
        location: "",
      },
      trek: {
        rating: 0,
        reviews: 0,
      },
    };
  }
};

