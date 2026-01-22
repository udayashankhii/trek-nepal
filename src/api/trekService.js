

// src/api/trekService.js
import axiosInstance from "./axiosInstance";

// ============================================
// IN-MEMORY CACHE CONFIGURATION
// ============================================
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (endpoint, params = {}) => 
  `${endpoint}_${JSON.stringify(params)}`;

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearTrekCache = () => cache.clear();

// ============================================
// REQUEST DEDUPLICATION
// ============================================
const pendingRequests = new Map();

const dedupedRequest = async (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  const promise = requestFn().finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, promise);
  return promise;
};

// ============================================
// MAIN TREK DATA FETCHERS
// ============================================

export const fetchAllTreks = async (filters = {}, useCache = true) => {
  const cacheKey = getCacheKey("treksall", filters);

  if (useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  return dedupedRequest(cacheKey, async () => {
    try {
      const cleanFilters = filters && typeof filters === 'object' && !Array.isArray(filters)
        ? { ...filters }
        : {};

      // ✅ FIX: Add limit parameter to fetch all treks
      const response = await axiosInstance.get("/treks/", { 
        params: { 
          limit: 100,  // ← ADD THIS LINE
          ...cleanFilters 
        }
      });
      const data = response.data;

      let treks = [];

      if (Array.isArray(data)) {
        treks = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.results)) {
          treks = data.results;
        } else if (Array.isArray(data.data)) {
          treks = data.data;
        } else if (Array.isArray(data.treks)) {
          treks = data.treks;
        }
      }

      setCache(cacheKey, treks);
      return treks;
    } catch (error) {
      console.error("Error fetching all treks:", error);
      return [];
    }
  });
};


export const fetchTrek = async (trekSlug, useCache = true) => {
  const cacheKey = getCacheKey("trek_detail", { slug: trekSlug });

  if (useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  return dedupedRequest(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(`treks/${trekSlug}/detail/`);
      const data = response.data;
      
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching trek:", error);
      throw error;
    }
  });
};

export const fetchPopularTreks = async (limit = 6, useCache = true) => {
  const cacheKey = getCacheKey("treks_popular", { limit });

  if (useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get("treks/popular/", {
      params: { limit },
    });
    const data = response.data.results || response.data;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching popular treks:", error);
    return [];
  }
};

export const fetchTrendingTreks = async (limit = 6, useCache = true) => {
  const cacheKey = getCacheKey("treks_trending", { limit });

  if (useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get("treks/trending/", {
      params: { limit },
    });
    const data = response.data.results || response.data;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching trending treks:", error);
    return [];
  }
};

// ============================================
// SECTION-SPECIFIC FETCHERS
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

export const fetchTrekReviews = async (trekSlug, page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/reviews/`, {
      params: { page, page_size: pageSize },
    });
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
    console.warn("Booking card not available:", error.message);
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
    const response = await axiosInstance.get(`treks/${trekSlug}/additional-info/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek additional info:", error);
    return null;
  }
};

export const fetchTrekMap = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/map/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek map:", error);
    return null;
  }
};

export const fetchTrekWeather = async (trekSlug, month = null) => {
  try {
    const params = month ? { month } : {};
    const response = await axiosInstance.get(`treks/${trekSlug}/weather/`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching trek weather:", error);
    return null;
  }
};

export const fetchTrekFAQs = async (trekSlug) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/faqs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek FAQs:", error);
    return [];
  }
};

export const fetchSimilarTreks = async (trekSlug, limit = 3) => {
  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/similar/`, {
      params: { limit },
    });
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
  } catch (error) {
    console.error("Error searching treks:", error);
    return [];
  }
};

// ============================================
// EXTRACTED DATA FROM MAIN TREK RESPONSE
// ============================================

/**
 * ✅ Extract elevation chart data from trek detail
 * Tries dedicated endpoint first, falls back to trek detail data
 */
/**
 * ✅ Extract elevation chart data from trek detail
 * Priority 1: Try dedicated endpoint
 * Priority 2: Extract from elevation_chart in trek data  
 * Priority 3: Transform itinerary_days altitude data
 */
export const fetchTrekElevationChart = async (trekSlug) => {
  try {
    // Try dedicated endpoint first
    const response = await axiosInstance.get(`treks/${trekSlug}/elevation-chart/`);
    
    // Check if we have meaningful data
    if (response.data?.points && Array.isArray(response.data.points) && response.data.points.length > 2) {
      return response.data;
    }
    
    // If endpoint returns insufficient data, fall through to fallback
    console.warn(`Elevation endpoint returned insufficient data (${response.data?.points?.length || 0} points)`);
  } catch (error) {
    console.warn(`Elevation chart endpoint not available for ${trekSlug}`);
  }

  // FALLBACK: Extract from main trek data and transform itinerary
  try {
    const trekData = await fetchTrek(trekSlug);
    if (!trekData) return null;

    // ✅ PRIORITY 2: Check existing elevation_chart with sufficient points
    const existingChart = trekData.elevation_chart || trekData.trek?.elevation_chart;
    if (existingChart?.points && Array.isArray(existingChart.points) && existingChart.points.length > 2) {
      return existingChart;
    }

    // ✅ PRIORITY 3: Transform itinerary_days altitude data
    const itineraryData = trekData.itinerary_days || trekData.itinerary || trekData.trek?.itinerary_days || [];
    
    if (Array.isArray(itineraryData) && itineraryData.length > 0) {
      const elevationPoints = itineraryData.map((day) => {
        // Parse altitude string: "1,337m" or "3870m" → numeric elevation
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

      // Only return if we have valid elevation data
      if (elevationPoints.length > 0 && elevationPoints.some(p => p.elevation > 0)) {
        return {
          title: `${trekData.title || trekData.trek?.title || "Trek"} - Elevation Profile`,
          subtitle: "Daily altitude changes throughout your trek",
          points: elevationPoints,
        };
      }
    }

    // No elevation data available
    console.warn(`⚠️ No elevation data available from any source for ${trekSlug}`);
    return null;
    
  } catch (fallbackError) {
    console.error(`Error extracting elevation data for ${trekSlug}:`, fallbackError);
    return null;
  }
};

/**
 * ✅ Extract dates and pricing data from trek detail
 * Tries dedicated endpoints, falls back to main trek response
 */
/**
 * ✅ Extract dates and pricing data from trek detail
 * Handles both nested departures_by_month and flat departures arrays
 */
export const fetchTrekCostAndDates = async (trekSlug) => {
  const cacheKey = getCacheKey("trek_cost_dates", { slug: trekSlug });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // Try dedicated combined endpoint first
    const response = await axiosInstance.get(`treks/${trekSlug}/cost-dates/`);
    const data = response.data;
    
    // ✅ TRANSFORM NESTED STRUCTURE TO FLAT
    const transformed = transformCostDatesResponse(data);
    setCache(cacheKey, transformed);
    return transformed;
    
  } catch (error) {
    // Fallback: Extract from main trek detail response
    console.warn(`Cost-dates endpoint not available for ${trekSlug}, extracting from trek detail`);
    
    try {
      const trekData = await fetchTrek(trekSlug);
      if (!trekData) {
        return { departures: [], group_prices: [], highlights: [] };
      }

      const flat = { ...trekData, ...(trekData.trek || {}) };
      
      // Extract and transform cost_dates if present
      const costDatesData = trekData.cost_dates || flat.cost_dates || {};
      const transformed = transformCostDatesResponse(costDatesData);
      
      setCache(cacheKey, transformed);
      return transformed;
      
    } catch (fallbackError) {
      console.error(`Error extracting cost-dates data for ${trekSlug}:`, fallbackError);
      return { departures: [], group_prices: [], highlights: [] };
    }
  }
};

/**
 * ✅ Helper function to transform API response to expected format
 */
function transformCostDatesResponse(data) {
  if (!data || typeof data !== 'object') {
    return { departures: [], group_prices: [], highlights: [] };
  }

  // ✅ 1. FLATTEN departures_by_month into single array
  let departures = [];
  if (data.departures_by_month && Array.isArray(data.departures_by_month)) {
    // Nested structure: flatten all departures from all months
    departures = data.departures_by_month.flatMap(monthGroup => 
      Array.isArray(monthGroup.departures) ? monthGroup.departures : []
    );
  } else if (data.departures && Array.isArray(data.departures)) {
    // Already flat
    departures = data.departures;
  }

  // ✅ 2. HANDLE both camelCase and snake_case for groupPrices
  let groupPrices = [];
  if (data.group_prices && Array.isArray(data.group_prices)) {
    groupPrices = data.group_prices;
  } else if (data.groupPrices && Array.isArray(data.groupPrices)) {
    // Convert camelCase to snake_case structure
    groupPrices = data.groupPrices.map(gp => ({
      label: gp.label,
      price: gp.price,
      min_size: gp.min_size || gp.minSize,
      max_size: gp.max_size || gp.maxSize,
      size: gp.size
    }));
  }

  // ✅ 3. EXTRACT highlights from objects if needed
  let highlights = [];
  if (data.highlights && Array.isArray(data.highlights)) {
    highlights = data.highlights.map(h => 
      typeof h === 'string' ? h : (h.highlight || h.text || '')
    ).filter(Boolean);
  }

  return {
    departures: departures,
    group_prices: groupPrices,
    highlights: highlights,
    intro_text: data.intro_text || ''
  };
}


/**
 * ✅ Extract departure dates from trek detail
 * For backward compatibility - prefer fetchTrekCostAndDates
 */
export const fetchTrekDates = async (trekSlug) => {
  const cacheKey = getCacheKey("trek_dates", { slug: trekSlug });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/dates/`);
    const departures = Array.isArray(response.data) 
      ? response.data 
      : response.data.departures || response.data.results || [];
    setCache(cacheKey, departures);
    return departures;
  } catch (error) {
    // Fallback: Use fetchTrekCostAndDates
    console.warn(`Dates endpoint not available for ${trekSlug}, using cost-dates fallback`);
    const costDatesData = await fetchTrekCostAndDates(trekSlug);
    return costDatesData.departures || [];
  }
};

/**
 * ✅ Extract pricing information from trek detail
 * For backward compatibility - prefer fetchTrekCostAndDates
 */
export const fetchTrekPricing = async (trekSlug) => {
  const cacheKey = getCacheKey("trek_pricing", { slug: trekSlug });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get(`treks/${trekSlug}/pricing/`);
    const pricing = Array.isArray(response.data) 
      ? response.data 
      : response.data.group_prices || response.data.pricing || response.data.results || [];
    setCache(cacheKey, pricing);
    return pricing;
  } catch (error) {
    // Fallback: Use fetchTrekCostAndDates
    console.warn(`Pricing endpoint not available for ${trekSlug}, using cost-dates fallback`);
    const costDatesData = await fetchTrekCostAndDates(trekSlug);
    return costDatesData.group_prices || [];
  }
};

/**
 * ⚠️ DEPRECATED - Use fetchTrekCostAndDates instead
 * Kept for backward compatibility
 */
export const fetchTrekCostDates = async (trekSlug) => {
  console.warn('fetchTrekCostDates is deprecated. Use fetchTrekCostAndDates instead');
  return fetchTrekCostAndDates(trekSlug);
};

// ============================================
// OPTIMIZED COMPOSITE FETCHERS
// ============================================

/**
 * ✅ Fetch comprehensive trek booking data
 */
export const fetchTrekBookingData = async (trekSlug) => {
  try {
    const [trekResult, bookingCardResult, highlightsResult] = await Promise.allSettled([
      fetchTrek(trekSlug),
      fetchTrekBookingCard(trekSlug),
      fetchTrekHighlights(trekSlug),
    ]);

    const trek = trekResult.status === "fulfilled" ? trekResult.value : null;
    const bookingCardData = bookingCardResult.status === "fulfilled" ? bookingCardResult.value : null;
    const highlights = highlightsResult.status === "fulfilled" ? highlightsResult.value : [];

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

/**
 * ✅ Fetch all trek data for detail pages
 */
export const fetchCompleteTrekData = async (trekSlug) => {
  try {
    // Fetch critical data first
    const criticalData = await Promise.allSettled([
      fetchTrek(trekSlug),
      fetchTrekHero(trekSlug),
      fetchTrekOverview(trekSlug),
    ]);

    // Fetch additional data in parallel
    const additionalData = await Promise.allSettled([
      fetchTrekHighlights(trekSlug),
      fetchTrekItinerary(trekSlug),
      fetchTrekCosts(trekSlug),
      fetchTrekActions(trekSlug),
      fetchTrekCostAndDates(trekSlug), // ✅ Using the fallback-enabled version
      fetchSimilarTreks(trekSlug, 3),
    ]);

    return {
      detail: criticalData[0].status === "fulfilled" ? criticalData[0].value : null,
      hero: criticalData[1].status === "fulfilled" ? criticalData[1].value : null,
      overview: criticalData[2].status === "fulfilled" ? criticalData[2].value : null,
      highlights: additionalData[0].status === "fulfilled" ? additionalData[0].value : [],
      itinerary: additionalData[1].status === "fulfilled" ? additionalData[1].value : [],
      costs: additionalData[2].status === "fulfilled" ? additionalData[2].value : { inclusions: [], exclusions: [] },
      actions: additionalData[3].status === "fulfilled" ? additionalData[3].value : null,
      costDates: additionalData[4].status === "fulfilled" ? additionalData[4].value : { departures: [], group_prices: [], highlights: [] },
      similar: additionalData[5].status === "fulfilled" ? additionalData[5].value : [],
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
    const response = await axiosInstance.get("treks/filters/");
    return response.data;
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
    const response = await axiosInstance.get(`treks/${trekSlug}/stats/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trek stats:", error);
    return null;
  }
};
