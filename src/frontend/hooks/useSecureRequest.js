import { useCallback, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import axiosInstance from "../context/api/axiosInstance";

const useSecureRequest = () => {
  const { token, setToken, logout, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Public routes that don't require token
  const publicRoutes = ["/login", "/signup", "/refresh-token"];

  // Check if JWT access token is expired
  const isTokenExpired = (tok) => {
    if (!tok) return true;
    try {
      const { exp } = JSON.parse(atob(tok.split(".")[1]));
      return Date.now() >= exp * 1000; // exp is in seconds
    } catch {
      return true;
    }
  };

  const secureRequest = useCallback(
    async (method, url, data = {}, options = {}) => {
      try {
        const isPublic = publicRoutes.some((route) => url.includes(route));
        let currentToken = localStorage.getItem("accessToken") || token;

        // Only refresh token if route is not public AND token missing/expired
        if (!isPublic && (!currentToken || isTokenExpired(currentToken))) {
          setIsRefreshing(true);
          const newTokenData = await refreshToken(); // Calls backend /refresh-token
          if (!newTokenData?.accessToken) {
            logout();
            throw new Error("Token expired and refresh failed");
          }
          currentToken = newTokenData.accessToken;
          setToken(currentToken);
        }

        // Axios config
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

        // Execute request
        return await axiosInstance(config);
      } catch (error) {
        // Retry once on 401
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
            } else {
              logout();
              throw new Error("Refresh token invalid");
            }
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
};

export default useSecureRequest;