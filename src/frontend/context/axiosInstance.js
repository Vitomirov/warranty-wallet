import axios from "axios";

// Define base URL for API from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // No cookies sent with requests
});

// Interceptor for requests - adds Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to request headers
      console.log(
        "axiosInstance: Request - Authorization header set:",
        config.headers.Authorization
      );
    } else {
      console.log("axiosInstance: Request - No token found.");
    }
    return config;
  },
  (error) => {
    // Handle request setup errors
    console.error("axiosInstance: Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
