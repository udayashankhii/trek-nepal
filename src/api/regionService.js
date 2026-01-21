
// src/api/regionService.js

// PUT THIS AT THE VERY TOP - BEFORE IMPORTS
export const REGIONS = {
  EVEREST: "everest",
  ANNAPURNA: "annapurna",
  LANGTANG: "langtang",
  MANASLU: "manaslu",
  MUSTANG: "mustang",
};

import axiosInstance from "./axiosInstance";

// Region cache
const regionCache = new Map();
const REGION_CACHE_DURATION = 10 * 60 * 1000;
//  * Fetch treks filtered by region

export const fetchTreksByRegion = async (regionSlug, filters = {}) => {
  try {
    const response = await axiosInstance.get("treks/", {
      params: { 
        region: regionSlug, 
        limit: 100, // Add this - or set to your max expected treks
        ...filters 
      },
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
