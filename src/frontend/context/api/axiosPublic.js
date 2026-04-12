import axios from "axios";

// Define base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : (window.location.hostname === "localhost"
      ? "http://localhost:3000/api"
      : "https://dejanvitomirov.com/api");

// Create an Axios instance for public routes (no authentication headers)
const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosPublic;
