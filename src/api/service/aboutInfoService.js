import axiosInstance from "./axiosInstance";

export const fetchAboutPages = async () => {
  try {
    const response = await axiosInstance.get("about/pages/");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  } catch (error) {
    console.error("Error fetching about pages:", error);
    return [];
  }
};

export const fetchAboutPage = async (slug) => {
  if (!slug) throw new Error("About page slug is required");
  try {
    const response = await axiosInstance.get(`about/pages/${slug}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch about page");
  }
};

export const fetchAboutSitemap = async () => {
  try {
    const response = await axiosInstance.get("about/sitemap/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching about sitemap:", error);
    return [];
  }
};
