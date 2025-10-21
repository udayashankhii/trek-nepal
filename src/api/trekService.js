// src/api/trekService.js
import axiosInstance from "./axiosInstance";

// Fetch all treks
export const fetchAllTreks = async () => {
  try {
    const response = await axiosInstance.get("treks/");
    const data = response.data;
    // Normalize the response into an array
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




// Fetch single trek by slug
export const fetchTrek = async (slug) => {
  try {
    const response = await axiosInstance.get(`treks/${slug}/detail/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trek ${slug}:`, error);
    throw new Error("Failed to fetch trek details");
  }
};

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

// Search treks (optional)
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


