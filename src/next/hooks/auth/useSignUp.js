"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/auth/AuthContext";
import useSecureRequest from "@/hooks/auth/useSecureRequest";
import { legacyPath } from "@/lib/base-path";

export default function useSignUp() {
  const { login } = useAuth();
  const { secureRequest } = useSecureRequest();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (userData) => {
    if (loading) return;

    const requiredFields = [
      "username",
      "userEmail",
      "password",
      "fullName",
      "userAddress",
      "userPhoneNumber",
    ];
    if (requiredFields.some((field) => !userData[field])) {
      setMessage("Please populate all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await secureRequest("post", "/signup", userData);

      if (response.data) {
        setMessage("Signup successful! Logging you in...");
        await login(userData.username, userData.password);
        window.location.assign(legacyPath("/dashboard"));
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const backendMessage = error.response.data.message;
        setMessage(backendMessage);
        console.error("Backend Error:", backendMessage);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
        console.error("Unknown Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, message, loading };
}
