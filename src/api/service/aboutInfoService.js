import { apiGet, normalizeArray } from "./helper";

export const fetchAboutPages = async () => {
  try {
    const data = await apiGet("about/pages/", {}, true, {
      cacheTTL: 15 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching about pages:", error);
    return [];
  }
};

export const fetchAboutPage = async (slug) => {
  if (!slug) throw new Error("About page slug is required");
  try {
    return await apiGet(`about/pages/${slug}/`, {}, true, {
      cacheTTL: 15 * 60 * 1000,
    });
  } catch (error) {
    throw new Error("Failed to fetch about page");
  }
};

export const fetchAboutSitemap = async () => {
  try {
    const data = await apiGet("about/sitemap/", {}, true, {
      cacheTTL: 30 * 60 * 1000,
    });
    return normalizeArray(data);
  } catch (error) {
    console.error("Error fetching about sitemap:", error);
    return [];
  }
};
