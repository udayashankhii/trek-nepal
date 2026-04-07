import axiosInstance from "./axiosInstance";
import { cacheManager } from "../../cache/CacheManager";
import { requestDeduplicator } from "../../cache/RequestDeduplicator";


/**
 * ✅ FIXED: Add 1 day to end date to correct API off-by-one error
 * 
 * The backend API returns end dates that are 1 day short due to exclusive
 * date range calculation. This function corrects it for inclusive date counting.
 * 
 * Example:
 * - API returns: Mar 9 → Mar 18 (10 days, exclusive end)
 * - We correct to: Mar 9 → Mar 19 (11 days, inclusive end)
 */
export const correctEndDate = (endDateStr) => {
  if (!endDateStr) return endDateStr;

  try {
    // ✅ Use UTC midnight to prevent toISOString from shifting dates
    const date = new Date(endDateStr + "T00:00:00Z");
    if (isNaN(date.getTime())) return endDateStr;

    // Add 1 day to convert from exclusive to inclusive end date
    date.setUTCDate(date.getUTCDate() + 1);

    const corrected = date.toISOString().split("T")[0];

    console.log(`📅 Date correction: ${endDateStr} → ${corrected}`);

    return corrected;
  } catch (error) {
    console.error("Error correcting end date:", error);
    return endDateStr;
  }
};


/**
 * Normalize API response to array format
 */
export const normalizeArray = (data, key = null) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (key && Array.isArray(data[key])) return data[key];
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.treks)) return data.treks;
  }
  return [];
};


const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

const cleanQueryParams = (params = {}) => {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return {};
  }

  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") return acc;
    acc[key] = value;
    return acc;
  }, {});
};


/**
 * Generic API GET request with caching and deduplication
 */
export const apiGet = async (endpoint, params = {}, useCache = true, options = {}) => {
  if (!endpoint) {
    throw new Error("apiGet requires an endpoint");
  }

  const {
    cacheTTL = DEFAULT_CACHE_TTL,
    axiosConfig = {},
  } = options;

  const normalizedParams = cleanQueryParams(params);
  const cacheKey = cacheManager.generateKey(endpoint, normalizedParams);

  if (useCache) {
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;
  }

  return requestDeduplicator.execute(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(endpoint, {
        ...axiosConfig,
        params: normalizedParams,
      });
      const data = response.data;

      if (useCache) {
        cacheManager.set(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  });
};


/**
 * ✅ UPDATED: Transform cost and dates response with corrected end dates
 */
export const transformCostDatesResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { departures: [], group_prices: [], highlights: [] };
  }

  // Flatten departures_by_month into single array
  let departures = [];
  if (data.departures_by_month && Array.isArray(data.departures_by_month)) {
    departures = data.departures_by_month.flatMap(monthGroup =>
      Array.isArray(monthGroup.departures) ? monthGroup.departures : []
    );
  } else if (data.departures && Array.isArray(data.departures)) {
    departures = data.departures;
  }

  // ✅ CRITICAL FIX: Correct end dates for all departures
  departures = departures.map(dep => {
    // Handle both snake_case and camelCase
    const endDate = dep.end || dep.end_date || dep.endDate;
    const startDate = dep.start || dep.start_date || dep.startDate;

    // Apply date correction to end date
    const correctedEnd = correctEndDate(endDate);

    return {
      ...dep,
      start: startDate,
      end: correctedEnd,  // ✅ Use corrected end date
      // Keep original field names for compatibility
      end_date: correctedEnd,
      start_date: startDate,
    };
  });

  // Handle both camelCase and snake_case for groupPrices
  let groupPrices = [];
  if (data.group_prices && Array.isArray(data.group_prices)) {
    groupPrices = data.group_prices;
  } else if (data.groupPrices && Array.isArray(data.groupPrices)) {
    groupPrices = data.groupPrices.map(gp => ({
      label: gp.label,
      price: gp.price,
      min_size: gp.min_size || gp.minSize,
      max_size: gp.max_size || gp.maxSize,
      size: gp.size
    }));
  }

  // Extract highlights from objects if needed
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
};