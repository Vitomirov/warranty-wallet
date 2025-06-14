import axios from "axios";

// Define base URL
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://devitowarranty.xyz/api";

// Create an Axios instance for public routes (no authentication headers)
const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosPublic;
