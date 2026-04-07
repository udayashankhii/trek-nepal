import { apiGet, normalizeArray } from "./helper";

export const fetchTours = async (params = {}) => {
  try {
    const data = await apiGet("tours/", params, true, {
      cacheTTL: 10 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
};

export const fetchTourDetail = async (slug) => {
  if (!slug) {
    throw new Error("Tour slug is required");
  }

  try {
    return await apiGet(`tours/${slug}/detail/`, {}, true, {
      cacheTTL: 10 * 60 * 1000,
    });
  } catch {
    throw new Error("Failed to fetch tour details");
  }
};

export const fetchTourSimilar = async (slug) => {
  if (!slug) return [];

  try {
    const data = await apiGet(`tours/${slug}/similar/`, {}, true, {
      cacheTTL: 10 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching similar tours:", error);
    return [];
  }
};

export const fetchTourReviews = async (slug) => {
  if (!slug) return [];

  try {
    const data = await apiGet(`tours/${slug}/reviews/`, {}, true, {
      cacheTTL: 3 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching tour reviews:", error);
    return [];
  }
};
