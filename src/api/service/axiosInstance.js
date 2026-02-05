// src/api/axiosInstance.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false, // Set to true if using cookies
});

// ============================================
// REQUEST INTERCEPTOR - Attach Auth Token
// ============================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Token Refresh
// ============================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token Expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token - redirect to login
        isRefreshing = false;
        localStorage.clear();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Refresh the token
        const response = await axios.post(
          `${BASE_URL}/api/accounts/token/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { access } = response.data;
        localStorage.setItem("accessToken", access);

        // Update auth header
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);
        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Refresh failed - clear storage and redirect
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // ============================================
    // FIX: Enhanced error handling WITHOUT creating new Error objects
    // ============================================
    // Return the error object directly instead of wrapping in new Error()
    // This prevents "target must be an object" error
    return Promise.reject(error); // CHANGED: Return error directly
  }
);

export default axiosInstance;
