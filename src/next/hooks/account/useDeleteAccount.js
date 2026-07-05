"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import useSecureRequest from "@/hooks/auth/useSecureRequest";

const useDeleteAccount = () => {
  const { logout } = useAuth();
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { secureRequest } = useSecureRequest();

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDeleteAccount = async () => {
    setError(null);
    try {
      await secureRequest("delete", "/me");
      alert("Your account has been deleted successfully.");
      logout();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(
        err.response?.data?.message || err.message || "Error deleting account."
      );
    }
  };

  return {
    showDeleteModal,
    error,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAccount,
  };
};

export default useDeleteAccount;
