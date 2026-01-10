

// src/api/regionService.js
import axiosInstance from "./axiosInstance";

// Region cache
const regionCache = new Map();
const REGION_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedRegion = (key) => {
  const cached = regionCache.get(key);
  if (cached && Date.now() - cached.timestamp < REGION_CACHE_DURATION) {
    return cached.data;
  }
  regionCache.delete(key);
  return null;
};

const setCachedRegion = (key, data) => {
  regionCache.set(key, { data, timestamp: Date.now() });
};

export const clearRegionCache = () => regionCache.clear();

// Region constants
export const REGIONS = {
  EVEREST: "everest",
  ANNAPURNA: "annapurna",
  LANGTANG: "langtang",
  MANASLU: "manaslu",
  MUSTANG: "mustang",
  DOLPO: "dolpo",
  KANCHENJUNGA: "kanchenjunga",
};

/**
 * Fetch all available regions
 */
export const fetchRegions = async (useCache = true) => {
  const cacheKey = "regions_all";

  if (useCache) {
    const cached = getCachedRegion(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get("regions/");
    const data = response.data;

    let regions = [];
    if (Array.isArray(data)) regions = data;
    else if (Array.isArray(data.results)) regions = data.results;
    else if (Array.isArray(data.data)) regions = data.data;

    setCachedRegion(cacheKey, regions);
    return regions;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw new Error(error.message || "Failed to fetch regions");
  }
};

/**
 * Fetch treks filtered by region
 */
export const fetchTreksByRegion = async (regionSlug, filters = {}) => {
  try {
    const response = await axiosInstance.get("treks/", {
      params: { region: regionSlug, ...filters },
    });
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;

    return [];
  } catch (error) {
    console.error(`Error fetching ${regionSlug} treks:`, error);
    throw new Error(error.message || `Failed to fetch ${regionSlug} treks`);
  }
};

/**
 * Fetch region details
 */
export const fetchRegionDetails = async (regionSlug, useCache = true) => {
  const cacheKey = `region_${regionSlug}`;

  if (useCache) {
    const cached = getCachedRegion(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await axiosInstance.get(`regions/${regionSlug}/`);
    const data = response.data;
    setCachedRegion(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching region ${regionSlug}:`, error);
    throw new Error(error.message || "Failed to fetch region details");
  }
};

/**
 * Fetch popular regions
 */
export const fetchPopularRegions = async (limit = 5) => {
  try {
    const response = await axiosInstance.get("regions/popular/", {
      params: { limit },
    });
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching popular regions:", error);
    return [];
  }
};

/**
 * Fetch region statistics
 */
export const fetchRegionStats = async (regionSlug) => {
  try {
    const response = await axiosInstance.get(`regions/${regionSlug}/stats/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching region ${regionSlug} stats:`, error);
    return {
      total_treks: 0,
      avg_duration: 0,
      avg_price: 0,
      difficulty_distribution: {},
    };
  }
};

/**
 * Fetch region highlights/features
 */
export const fetchRegionHighlights = async (regionSlug) => {
  try {
    const response = await axiosInstance.get(`regions/${regionSlug}/highlights/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching region ${regionSlug} highlights:`, error);
    return [];
  }
};
