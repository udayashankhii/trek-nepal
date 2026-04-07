import { apiGet, normalizeArray } from "./helper";

export const fetchTravelInfoPages = async () => {
  try {
    const data = await apiGet("travel-info/pages/", {}, true, {
      cacheTTL: 15 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching travel info pages:", error);
    return [];
  }
};

export const fetchTravelInfoPage = async (slug) => {
  if (!slug) throw new Error("Travel info slug is required");
  try {
    return await apiGet(`travel-info/pages/${slug}/`, {}, true, {
      cacheTTL: 15 * 60 * 1000,
    });
  } catch {
    throw new Error("Failed to fetch travel info page");
  }
};

export const fetchTravelInfoSitemap = async () => {
  try {
    const data = await apiGet("travel-info/sitemap/", {}, true, {
      cacheTTL: 30 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching travel info sitemap:", error);
    return [];
  }
};
