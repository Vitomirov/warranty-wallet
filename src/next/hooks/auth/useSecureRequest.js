"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import axiosInstance from "@/lib/api/client";

export default function useSecureRequest() {
  const { token, setToken, logout, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const publicRoutes = ["/login", "/signup", "/refresh-token"];

  const isTokenExpired = (tok) => {
    if (!tok) return true;
    try {
      const { exp } = JSON.parse(atob(tok.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const secureRequest = useCallback(
    async (method, url, data = {}, options = {}) => {
      try {
        const isPublic = publicRoutes.some((route) => url.includes(route));
        let currentToken = localStorage.getItem("accessToken") || token;

        if (!isPublic && (!currentToken || isTokenExpired(currentToken))) {
          setIsRefreshing(true);
          const newTokenData = await refreshToken();
          if (!newTokenData?.accessToken) {
            logout();
            throw new Error("Token expired and refresh failed");
          }
          currentToken = newTokenData.accessToken;
          setToken(currentToken);
        }

        const config = {
          ...options,
          method,
          url,
          ...(data ? { data } : {}),
          headers: {
            ...options.headers,
            ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
          },
        };

        return await axiosInstance(config);
      } catch (error) {
        if (error.response?.status === 401 && !options._retry) {
          try {
            setIsRefreshing(true);
            const newTokenData = await refreshToken();
            if (newTokenData?.accessToken) {
              const newToken = newTokenData.accessToken;
              setToken(newToken);
              return secureRequest(method, url, data, {
                ...options,
                _retry: true,
              });
            }
            logout();
            throw new Error("Refresh token invalid");
          } catch (refreshError) {
            logout();
            throw refreshError;
          } finally {
            setIsRefreshing(false);
          }
        }
        throw error;
      } finally {
        setIsRefreshing(false);
      }
    },
    [token, setToken, logout, refreshToken]
  );

  return { secureRequest, isRefreshing };
}
