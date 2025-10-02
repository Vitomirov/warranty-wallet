import { useCallback, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import axiosInstance from "../context/api/axiosInstance";

const useSecureRequest = () => {
  const { token, setToken, logout, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper: check if access token is expired
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
        // Always get latest access token from context or localStorage
        let currentToken = localStorage.getItem("accessToken") || token;

        // If token missing or expired, call refresh-token endpoint
        if (!currentToken || isTokenExpired(currentToken)) {
          setIsRefreshing(true);
          const newTokenData = await refreshToken(); // Calls backend /refresh-token
          if (!newTokenData?.accessToken) {
            logout();
            throw new Error("Token expired and refresh failed");
          }
          currentToken = newTokenData.accessToken;
          setToken(currentToken); // Update context + localStorage
        }

        // Configure Axios request
        const config = {
          ...options,
          method,
          url,
          ...(data ? { data } : {}),
          headers: {
            ...options.headers,
            Authorization: `Bearer ${currentToken}`,
          },
        };

        // Execute request
        return await axiosInstance(config);
      } catch (error) {
        // Retry once if server returns 401
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
