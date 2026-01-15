import axiosInstance from "./axiosInstance";

export const fetchTravelInfoPages = async () => {
  try {
    const response = await axiosInstance.get("travel-info/pages/");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  } catch (error) {
    console.error("Error fetching travel info pages:", error);
    return [];
  }
};

export const fetchTravelInfoPage = async (slug) => {
  if (!slug) throw new Error("Travel info slug is required");
  try {
    const response = await axiosInstance.get(`travel-info/pages/${slug}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch travel info page");
  }
};

export const fetchTravelInfoSitemap = async () => {
  try {
    const response = await axiosInstance.get("travel-info/sitemap/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching travel info sitemap:", error);
    return [];
  }
};
