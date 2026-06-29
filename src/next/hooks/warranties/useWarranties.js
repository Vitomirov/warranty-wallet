"use client";

import { useState, useEffect, useCallback } from "react";
import useSecureRequest from "@/hooks/auth/useSecureRequest";

export default function useWarranties() {
  const { secureRequest } = useSecureRequest();
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarranties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await secureRequest("get", "/warranties");
      setWarranties(response.data || []);
    } catch (err) {
      console.error("Failed to fetch warranties:", err);
      setError("Failed to load warranties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [secureRequest]);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  return { warranties, loading, error, fetchWarranties };
}
