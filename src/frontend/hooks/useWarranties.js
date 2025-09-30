import { useState, useEffect, useCallback } from "react";
import useSecureRequest from "./useSecureRequest";

const useWarranties = () => {
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

  const deleteWarranty = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await secureRequest("delete", `/warranties/${id}`);
        fetchWarranties();
      } catch (err) {
        console.error("Failed to delete warranty:", err);
        setError("Failed to delete warranty. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [secureRequest, fetchWarranties]
  );

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  return { warranties, loading, error, fetchWarranties, deleteWarranty };
};

export default useWarranties;
