import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error handling for production
    if (error.response) {
      // Server responded with error status
      const message = 
        error.response.data?.message || 
        error.response.data?.detail || 
        `Server error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(
        new Error("No response from server. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || "Network Error"));
    }
  }
);

export default axiosInstance;
