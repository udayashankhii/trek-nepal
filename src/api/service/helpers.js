import axiosInstance from "../axiosInstance";
import { cacheManager } from "../../cache/CacheManager";
import { requestDeduplicator } from "../../cache/RequestDeduplicator";

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

/**
 * Generic API GET request with caching and deduplication
 */
export const apiGet = async (endpoint, params = {}, useCache = true) => {
  const cacheKey = cacheManager.generateKey(endpoint, params);

  if (useCache) {
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;
  }

  return requestDeduplicator.execute(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      const data = response.data;
      
      if (useCache) {
        cacheManager.set(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  });
};

/**
 * Transform cost and dates response to flat structure
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
