"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/auth/AuthContext";
import axiosInstance from "@/lib/api/client";

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => localStorage.getItem("accessToken") || null;

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setToken(getInitialToken());
    setUser(getInitialUser());
    setIsHydrated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

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

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [user]);

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
      isHydrated,
    }),
    [token, user, login, logout, refreshToken, updateUser, isLoading, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
