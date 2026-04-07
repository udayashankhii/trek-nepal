
// src/api/regionService.js

// PUT THIS AT THE VERY TOP - BEFORE IMPORTS
export const REGIONS = {
  EVEREST: "everest",
  ANNAPURNA: "annapurna",
  LANGTANG: "langtang",
  MANASLU: "manaslu",
  MUSTANG: "mustang",
};

import { apiGet, normalizeArray } from "./helper";
//  * Fetch treks filtered by region

export const fetchTreksByRegion = async (regionSlug, filters = {}) => {
  if (!regionSlug) return [];

  try {
    const data = await apiGet(
      "treks/",
      {
        region: regionSlug,
        limit: 100,
        ...filters,
      },
      true,
      {
        cacheTTL: 10 * 60 * 1000,
      }
    );

    return normalizeArray(data);
  } catch (error) {
    console.error(`Error fetching ${regionSlug} treks:`, error);
    throw new Error(error.message || `Failed to fetch ${regionSlug} treks`);
  }
};

export const fetchRegions = async () => {
  try {
    const data = await apiGet("regions/", {}, true, {
      cacheTTL: 30 * 60 * 1000,
    });

    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};
