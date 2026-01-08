// api/regionService.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/treks/",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Region slug mapping (adjust these to match your Django backend)
export const REGIONS = {
  EVEREST: "everest",
  ANNAPURNA: "annapurna",
  LANGTANG: "langtang",
  MANASLU: "manaslu",
  MUSTANG: "mustang",
};

// Fetch all treks (for homepage or general listings)
export const fetchAllTreks = async () => {
  try {
    const response = await apiClient.get("");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error("Error fetching all treks:", error);
    throw error;
  }
};

// Fetch treks filtered by region
export const fetchTreksByRegion = async (regionSlug) => {
  try {
    const response = await apiClient.get(`?region=${regionSlug}`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`Error fetching treks for region ${regionSlug}:`, error);
    throw error;
  }
};
