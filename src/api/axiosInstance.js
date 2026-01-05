import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : new Error("Network Error")
    );
  }
);

export default axiosInstance;
