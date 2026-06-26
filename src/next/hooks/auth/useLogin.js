"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthContext";
import { legacyPath } from "@/lib/base-path";

/**
 * Custom hook for handling the user login process.
 * It manages form state, login logic, and navigation.
 */
export default function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await login(username, password);
      if (response?.accessToken) {
        window.location.assign(legacyPath("/dashboard"));
      } else {
        setError("Login failed: The server response was unexpected.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: Wrong username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCancel = () => router.push("/");

  return {
    username,
    password,
    error,
    loading,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleCancel,
  };
}
