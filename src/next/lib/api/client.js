"use client";

import axios from "axios";
import { BASE_PATH } from "@/lib/base-path";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/api`;
  }

  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return BASE_PATH ? `${BASE_PATH}/api` : "/api";
    }
    return `${window.location.origin}${BASE_PATH}/api`;
  }

  return "http://localhost:3000/api";
}

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.baseURL) {
      config.baseURL = resolveApiBaseUrl();
    }

    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
