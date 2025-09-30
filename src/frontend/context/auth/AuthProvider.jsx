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
  const [token, setToken] = useState(getInitialToken);
  const [user, setUser] = useState(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Automatically refresh token before expiration
  useEffect(() => {
    if (!token) return;

    let timer;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const refreshTime = exp * 1000 - Date.now() - 30000;
      if (refreshTime > 0) {
        timer = setTimeout(refreshToken, refreshTime);
      }
    } catch {
      logout();
    }
    return () => clearTimeout(timer);
  }, [token]);

  // Login
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/login", {
        username,
        password,
      });
      if (!data?.accessToken) throw new Error("Access token not found");

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);

      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const { data } = await axiosInstance.post("/refresh-token");
      if (!data?.accessToken) throw new Error("Access token not found");

      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
      return data;
    } catch (err) {
      logout();
      throw err;
    }
  }, [logout]);

  // Update user
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

  // Memoize context value
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
