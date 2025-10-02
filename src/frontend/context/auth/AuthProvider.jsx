import React, { useState, useEffect, useMemo, useCallback } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => localStorage.getItem("accessToken") || null;

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getInitialToken);
  const [user, setUser] = useState(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);

  // Core actions
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const { data } = await axiosInstance.post("/refresh-token");
      if (!data?.accessToken) throw new Error("Access token not found");
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      return data;
    } catch {
      logout();
      throw new Error("Refresh failed");
    }
  }, [logout]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/login", {
        username,
        password,
      });
      if (!data?.accessToken) throw new Error("Access token missing");
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((newUserData) => {
    if (!newUserData) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Automatic token refresh before expiry
  useEffect(() => {
    if (!token) return;

    const scheduleRefresh = () => {
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        const refreshTime = exp * 1000 - Date.now() - 30_000;
        if (refreshTime > 0) {
          return setTimeout(refreshToken, refreshTime);
        }
      } catch {
        logout();
      }
    };

    const timer = scheduleRefresh();
    return () => clearTimeout(timer);
  }, [token, refreshToken, logout]);

  // Hydrate user from localStorage if context lost
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [user]);

  // Refresh token on tab visibility
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          try {
            const { exp } = JSON.parse(atob(storedToken.split(".")[1]));
            if (exp * 1000 - Date.now() < 60_000) {
              await refreshToken();
            }
          } catch {
            logout();
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshToken, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      refreshToken,
      updateUser,
      setToken,
      isLoading,
    }),
    [token, user, login, logout, refreshToken, updateUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
