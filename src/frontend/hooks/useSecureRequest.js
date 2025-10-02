import { useCallback, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import axiosInstance from "../context/api/axiosInstance";

const useSecureRequest = () => {
  const { token, setToken, logout, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        // Always get latest token from localStorage to avoid stale context
        let currentToken = localStorage.getItem("accessToken") || token;

        if (!currentToken || isTokenExpired(currentToken)) {
          setIsRefreshing(true);
          const newToken = await refreshToken();
          if (!newToken) {
            logout();
            throw new Error("Token expired and refresh failed");
          }
          setToken(newToken);
          currentToken = newToken;
        }

        const config = { ...options, method, url, ...(data ? { data } : {}) };

        if (currentToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${currentToken}`,
          };
        }

        return await axiosInstance(config);
      } catch (error) {
        if (error.response?.status === 401 && !options._retry) {
          try {
            setIsRefreshing(true);
            const newToken = await refreshToken();
            if (newToken) {
              setToken(newToken);
              return secureRequest(method, url, data, {
                ...options,
                _retry: true,
              });
            } else {
              logout();
              throw new Error("Token refresh failed");
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
