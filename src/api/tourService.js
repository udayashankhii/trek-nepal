import axiosInstance from "./axiosInstance";

export const fetchTours = async (params = {}) => {
  try {
    const response = await axiosInstance.get("tours/", { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
    console.warn("Unexpected tour list response format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
};

export const fetchTourDetail = async (slug) => {
  try {
    const response = await axiosInstance.get(`tours/${slug}/detail/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tour details");
  }
};

export const fetchTourSimilar = async (slug) => {
  try {
    const response = await axiosInstance.get(`tours/${slug}/similar/`);
    const data = response.data;
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Error fetching similar tours:", error);
    return [];
  }
};

export const fetchTourReviews = async (slug) => {
  try {
    const response = await axiosInstance.get(`tours/${slug}/reviews/`);
    const data = response.data;
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Error fetching tour reviews:", error);
    return [];
  }
};
