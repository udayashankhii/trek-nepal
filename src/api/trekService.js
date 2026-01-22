

import{  cacheManager}  from "../cache/CacheManager";
import {apiGet, normalizeArray, transformCostDatesResponse}  from "./service/helpers";

// ============================================
// MAIN TREK DATA FETCHERS
// ============================================

export const fetchAllTreks = async (filters = {}, useCache = true) => {
  const cleanFilters = filters && typeof filters === 'object' && !Array.isArray(filters)
    ? { ...filters }
    : {};

  const data = await apiGet("/treks/", { limit: 100, ...cleanFilters }, useCache);
  return normalizeArray(data);
};

export const fetchTrek = async (trekSlug, useCache = true) => {
  return apiGet(`/treks/${trekSlug}/detail/`, {}, useCache);
};

export async function fetchPopularTreks(limit = 3, useCache = true) {
  const data = await apiGet("/treks/popular/", { limit }, useCache);
  return normalizeArray(data);
}

export const fetchTrendingTreks = async (limit = 6, useCache = true) => {
  const data = await apiGet("/treks/trending/", { limit }, useCache);
  return normalizeArray(data);
};

export const searchTreks = async (query = "", filters = {}) => {
  const data = await apiGet("/treks/search/", { q: query, ...filters });
  return normalizeArray(data);
};

// ============================================
// SECTION-SPECIFIC FETCHERS
// ============================================

export const fetchTrekKeyInfo = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/key-info/`);
  } catch (error) {
    console.error("Error fetching trek key info:", error);
    return null;
  }
};

export const fetchTrekOverview = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/overview/`);
  } catch (error) {
    console.error("Error fetching trek overview:", error);
    return null;
  }
};

export const fetchTrekHighlights = async (trekSlug) => {
  try {
    const data = await apiGet(`/treks/${trekSlug}/highlights/`);
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching trek highlights:", error);
    return [];
  }
};

export const fetchTrekItinerary = async (trekSlug) => {
  try {
    const data = await apiGet(`/treks/${trekSlug}/itinerary/`);
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching trek itinerary:", error);
    return [];
  }
};

export const fetchTrekCosts = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/costs/`);
  } catch (error) {
    console.error("Error fetching trek costs:", error);
    return { inclusions: [], exclusions: [] };
  }
};

export const fetchTrekActions = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/actions/`);
  } catch (error) {
    console.error("Error fetching trek actions:", error);
    return null;
  }
};

export const fetchTrekReviews = async (trekSlug, page = 1, pageSize = 10) => {
  try {
    return await apiGet(`/treks/${trekSlug}/reviews/`, { page, page_size: pageSize });
  } catch (error) {
    console.error("Error fetching trek reviews:", error);
    return { trek: null, count: 0, results: [] };
  }
};

export const fetchTrekBookingCard = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/booking-card/`);
  } catch (error) {
    console.warn("Booking card not available:", error.message);
    return null;
  }
};

export const fetchTrekGallery = async (trekSlug) => {
  try {
    const data = await apiGet(`/treks/${trekSlug}/gallery/`);
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching trek gallery:", error);
    return [];
  }
};

export const fetchTrekHero = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/hero/`);
  } catch (error) {
    console.warn(`Hero endpoint not available for ${trekSlug}, using fallback`);

    try {
      const trekData = await fetchTrek(trekSlug);
      if (!trekData) throw new Error("Trek data not available");

      const flat = { ...trekData, ...(trekData.trek || {}) };

      return {
        title: flat.title || flat.name || "Trek",
        subtitle: flat.subtitle || flat.short_description || "",
        imageUrl: flat.cover_image || flat.card_image_url || "/images/default-hero.jpg",
        duration: flat.duration || "N/A",
        difficulty: flat.trip_grade || flat.difficulty || "Moderate",
        location: flat.region || flat.location || "",
        season: flat.best_season || "",
      };
    } catch (fallbackError) {
      console.error("Failed to create hero fallback:", fallbackError);
      throw new Error("Unable to load trek information");
    }
  }
};

export const fetchTrekAdditionalInfo = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/additional-info/`);
  } catch (error) {
    console.error("Error fetching trek additional info:", error);
    return null;
  }
};

export const fetchTrekMap = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/map/`);
  } catch (error) {
    console.error("Error fetching trek map:", error);
    return null;
  }
};

export const fetchTrekWeather = async (trekSlug, month = null) => {
  try {
    const params = month ? { month } : {};
    return await apiGet(`/treks/${trekSlug}/weather/`, params);
  } catch (error) {
    console.error("Error fetching trek weather:", error);
    return null;
  }
};

export const fetchTrekFAQs = async (trekSlug) => {
  try {
    const data = await apiGet(`/treks/${trekSlug}/faqs/`);
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching trek FAQs:", error);
    return [];
  }
};

export const fetchSimilarTreks = async (trekSlug, limit = 3) => {
  try {
    const data = await apiGet(`/treks/${trekSlug}/similar/`, { limit });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching similar treks:", error);
    return [];
  }
};

// ============================================
// EXTRACTED DATA FROM MAIN TREK RESPONSE
// ============================================

export const fetchTrekElevationChart = async (trekSlug) => {
  try {
    const response = await apiGet(`/treks/${trekSlug}/elevation-chart/`);
    
    if (response?.points && Array.isArray(response.points) && response.points.length > 2) {
      return response;
    }
    
    console.warn(`Elevation endpoint returned insufficient data (${response?.points?.length || 0} points)`);
  } catch (error) {
    console.warn(`Elevation chart endpoint not available for ${trekSlug}`);
  }

  try {
    const trekData = await fetchTrek(trekSlug);
    if (!trekData) return null;

    const existingChart = trekData.elevation_chart || trekData.trek?.elevation_chart;
    if (existingChart?.points && Array.isArray(existingChart.points) && existingChart.points.length > 2) {
      return existingChart;
    }

    const itineraryData = trekData.itinerary_days || trekData.itinerary || trekData.trek?.itinerary_days || [];
    
    if (Array.isArray(itineraryData) && itineraryData.length > 0) {
      const elevationPoints = itineraryData.map((day) => {
        const altitudeStr = day.altitude || "0m";
        const elevation = parseInt(
          altitudeStr.replace(/,/g, "").replace(/m/g, "").trim(),
          10
        ) || 0;

        return {
          day: day.day,
          title: day.title || `Day ${day.day}`,
          elevation: elevation,
          description: day.description ? day.description.substring(0, 150) : "",
        };
      });

      if (elevationPoints.length > 0 && elevationPoints.some(p => p.elevation > 0)) {
        return {
          title: `${trekData.title || trekData.trek?.title || "Trek"} - Elevation Profile`,
          subtitle: "Daily altitude changes throughout your trek",
          points: elevationPoints,
        };
      }
    }

    console.warn(`⚠️ No elevation data available from any source for ${trekSlug}`);
    return null;
    
  } catch (fallbackError) {
    console.error(`Error extracting elevation data for ${trekSlug}:`, fallbackError);
    return null;
  }
};

export const fetchTrekCostAndDates = async (trekSlug) => {
  const cacheKey = cacheManager.generateKey("trek_cost_dates", { slug: trekSlug });
  const cached = cacheManager.get(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiGet(`/treks/${trekSlug}/cost-dates/`, {}, true);
    const transformed = transformCostDatesResponse(data);
    cacheManager.set(cacheKey, transformed);
    return transformed;
  } catch (error) {
    console.warn(`Cost-dates endpoint not available for ${trekSlug}, extracting from trek detail`);
    
    try {
      const trekData = await fetchTrek(trekSlug);
      if (!trekData) {
        return { departures: [], group_prices: [], highlights: [] };
      }

      const flat = { ...trekData, ...(trekData.trek || {}) };
      const costDatesData = trekData.cost_dates || flat.cost_dates || {};
      const transformed = transformCostDatesResponse(costDatesData);
      
      cacheManager.set(cacheKey, transformed);
      return transformed;
    } catch (fallbackError) {
      console.error(`Error extracting cost-dates data for ${trekSlug}:`, fallbackError);
      return { departures: [], group_prices: [], highlights: [] };
    }
  }
};

// ============================================
// BACKWARD COMPATIBILITY FUNCTIONS
// ============================================

export const fetchTrekDates = async (trekSlug) => {
  const cacheKey = cacheManager.generateKey("trek_dates", { slug: trekSlug });
  const cached = cacheManager.get(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiGet(`/treks/${trekSlug}/dates/`);
    const departures = normalizeArray(data, 'departures');
    cacheManager.set(cacheKey, departures);
    return departures;
  } catch (error) {
    console.warn(`Dates endpoint not available for ${trekSlug}, using cost-dates fallback`);
    const costDatesData = await fetchTrekCostAndDates(trekSlug);
    return costDatesData.departures || [];
  }
};

export const fetchTrekPricing = async (trekSlug) => {
  const cacheKey = cacheManager.generateKey("trek_pricing", { slug: trekSlug });
  const cached = cacheManager.get(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiGet(`/treks/${trekSlug}/pricing/`);
    const pricing = normalizeArray(data, 'group_prices') || 
                    normalizeArray(data, 'pricing');
    cacheManager.set(cacheKey, pricing);
    return pricing;
  } catch (error) {
    console.warn(`Pricing endpoint not available for ${trekSlug}, using cost-dates fallback`);
    const costDatesData = await fetchTrekCostAndDates(trekSlug);
    return costDatesData.group_prices || [];
  }
};

export const fetchTrekCostDates = async (trekSlug) => {
  console.warn('fetchTrekCostDates is deprecated. Use fetchTrekCostAndDates instead');
  return fetchTrekCostAndDates(trekSlug);
};

// ============================================
// OPTIMIZED COMPOSITE FETCHERS
// ============================================

export const fetchTrekBookingData = async (trekSlug) => {
  try {
    const results = await Promise.allSettled([
      fetchTrek(trekSlug),
      fetchTrekBookingCard(trekSlug),
      fetchTrekHighlights(trekSlug),
    ]);

    const trek = results[0].status === "fulfilled" ? results[0].value : null;
    const bookingCardData = results[1].status === "fulfilled" ? results[1].value : null;
    const highlights = results[2].status === "fulfilled" ? results[2].value : [];

    if (!trek) {
      throw new Error("Trek not found");
    }

    const flat = { ...trek, ...(trek.trek || {}) };
    const heroData = trek.hero || flat.hero || {};

    const hero = {
      title: heroData.title || flat.title || flat.name || "Trek",
      subtitle: heroData.subtitle || flat.subtitle || flat.short_description || "",
      imageUrl: heroData.imageUrl || heroData.image_url || flat.card_image_url || flat.cover_image || "/images/default-hero.jpg",
      duration: heroData.duration || flat.duration || "N/A",
      difficulty: heroData.difficulty || flat.trek_grade || flat.trip_grade || flat.difficulty || "Moderate",
      location: heroData.location || flat.region_name || flat.region || "",
      season: heroData.season || flat.best_season || "",
    };

    const trekInfo = {
      id: flat.id || flat.trek_id || trek.id,
      slug: flat.slug || trekSlug,
      name: flat.title || flat.name,
      title: flat.title || flat.name,
      rating: flat.rating || bookingCardData?.rating || 4.8,
      reviews: flat.reviews_count || bookingCardData?.reviews_count || 0,
      base_price: bookingCardData?.base_price || flat.base_price || trek.base_price || flat.price || "1000",
      price: flat.price || bookingCardData?.base_price || flat.base_price || "1000",
      currency: bookingCardData?.currency || flat.currency || "USD",
      duration: flat.duration,
      difficulty: flat.trek_grade || flat.trip_grade || flat.difficulty,
      region: flat.region_name || flat.region,
      booking_card: bookingCardData,
    };

    return {
      hero,
      trek: trekInfo,
      highlights: Array.isArray(highlights) ? highlights : [],
      bookingCard: bookingCardData,
    };
  } catch (error) {
    console.error("Error fetching trek booking data:", error);
    throw error;
  }
};

export const fetchCompleteTrekData = async (trekSlug) => {
  try {
    const criticalResults = await Promise.allSettled([
      fetchTrek(trekSlug),
      fetchTrekHero(trekSlug),
      fetchTrekOverview(trekSlug),
    ]);

    const additionalResults = await Promise.allSettled([
      fetchTrekHighlights(trekSlug),
      fetchTrekItinerary(trekSlug),
      fetchTrekCosts(trekSlug),
      fetchTrekActions(trekSlug),
      fetchTrekCostAndDates(trekSlug),
      fetchSimilarTreks(trekSlug, 3),
    ]);

    return {
      detail: criticalResults[0].status === "fulfilled" ? criticalResults[0].value : null,
      hero: criticalResults[1].status === "fulfilled" ? criticalResults[1].value : null,
      overview: criticalResults[2].status === "fulfilled" ? criticalResults[2].value : null,
      highlights: additionalResults[0].status === "fulfilled" ? additionalResults[0].value : [],
      itinerary: additionalResults[1].status === "fulfilled" ? additionalResults[1].value : [],
      costs: additionalResults[2].status === "fulfilled" ? additionalResults[2].value : { inclusions: [], exclusions: [] },
      actions: additionalResults[3].status === "fulfilled" ? additionalResults[3].value : null,
      costDates: additionalResults[4].status === "fulfilled" ? additionalResults[4].value : { departures: [], group_prices: [], highlights: [] },
      similar: additionalResults[5].status === "fulfilled" ? additionalResults[5].value : [],
    };
  } catch (error) {
    console.error("Error fetching complete trek data:", error);
    throw error;
  }
};

// ============================================
// FILTERS & STATS
// ============================================

export const fetchTrekFilters = async () => {
  try {
    return await apiGet("/treks/filters/");
  } catch (error) {
    console.error("Error fetching trek filters:", error);
    return {
      regions: [],
      difficulties: [],
      durations: [],
      price_ranges: [],
    };
  }
};

export const fetchTrekStats = async (trekSlug) => {
  try {
    return await apiGet(`/treks/${trekSlug}/stats/`);
  } catch (error) {
    console.error("Error fetching trek stats:", error);
    return null;
  }
};

export const clearTrekCache = () => cacheManager.clear();
