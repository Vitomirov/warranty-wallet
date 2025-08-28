import { useState, useEffect } from "react";
import axiosInstance from "../context/api/axiosInstance";

const useWarranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/warranties/all");
      setWarranties(response.data || []);
    } catch (err) {
      console.error("Failed to fetch warranties:", err);
      setError("Failed to load warranties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteWarranty = async (id) => {
    // Implement delete logic here if needed, and then call fetchWarranties()
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return { warranties, loading, error, fetchWarranties };
};

export default useWarranties;
