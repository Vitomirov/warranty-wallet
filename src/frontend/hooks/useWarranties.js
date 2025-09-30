import { useState, useEffect } from "react";
import axiosInstance from "../context/api/axiosInstance";

const useWarranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/warranties");
      setWarranties(response.data || []);
    } catch (err) {
      console.error("Failed to fetch warranties:", err);
      setError("Failed to load warranties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteWarranty = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/warranties/${id}`);
      fetchWarranties();
    } catch (err) {
      console.error("Failed to delete warranty:", err);
      setError("Failed to delete warranty. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return { warranties, loading, error, fetchWarranties, deleteWarranty };
};

export default useWarranties;
