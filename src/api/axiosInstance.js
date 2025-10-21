
import axios from "axios";


// Configure your backend API base URL here:
const axiosInstance = axios.create({
 baseURL: "http://127.0.0.1:8000/api/", // Django or FastAPI backend root
 headers: {
 "Content-Type": "application/json",
 },
 timeout: 8000,
});

// Optional interceptors for logging or authentication
axiosInstance.interceptors.response.use(
(response) => response,
 (error) => {
 console.error("API Error:", error);
return Promise.reject(
 error.response ? error.response.data : new Error("Network Error")
);
 }
);


export default axiosInstance;