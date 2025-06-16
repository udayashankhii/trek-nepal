// src/api/trekService.js

// ==================== MOCK MODE ENABLED ====================
import {
  fetchTrek as getMockTrek,
  fetchAllTreks as getAllMockTreks,
} from "./mockData.js";

// ==================== MOCKED API HELPERS ====================

// Fetch single trek by slug (mock only)
export const fetchTrek = async (slug) => {
  try {
    return await getMockTrek(slug);
  } catch (err) {
    console.error("Mock error in fetchTrek:", err);
    throw new Error("Failed to load trek. Please try again.");
  }
};

// Fetch all treks (mock only)
export const fetchAllTreks = async () => {
  try {
    return await getAllMockTreks();
  } catch (err) {
    console.error("Mock error in fetchAllTreks:", err);
    throw new Error("Unable to fetch treks.");
  }
};

// ==================== Derived APIs (Still Using Mock) ====================

// Fetch similar treks from same region
export const fetchSimilarTreks = async (slug, limit = 3) => {
  try {
    const currentTrek = await fetchTrek(slug);
    const allTreks = await fetchAllTreks();

    return allTreks
      .filter(
        (trek) =>
          trek.slug !== slug &&
          trek.region?.toLowerCase() === currentTrek.region?.toLowerCase()
      )
      .slice(0, limit);
  } catch (err) {
    console.error("Error fetching similar treks:", err);
    return [];
  }
};

// Search treks with optional filters
export const searchTreks = async (query = "", filters = {}) => {
  try {
    const allTreks = await fetchAllTreks();
    let results = allTreks;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (trek) =>
          trek.name?.toLowerCase().includes(lowerQuery) ||
          trek.region?.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.region) {
      results = results.filter(
        (trek) => trek.region?.toLowerCase() === filters.region.toLowerCase()
      );
    }

    return results;
  } catch (err) {
    console.error("Error searching treks:", err);
    return [];
  }
};
