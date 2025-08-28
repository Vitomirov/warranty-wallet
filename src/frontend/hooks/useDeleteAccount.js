import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import useSecureRequest from "./useSecureRequest";

const useDeleteAccount = () => {
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { secureRequest } = useSecureRequest();

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    setError(null);
    try {
      await secureRequest("delete", "/me");

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear tokens from cookies
      ["accessToken", "refreshToken"].forEach((tokenName) => {
        document.cookie = `${tokenName}=; Max-Age=0; path=/;`;
        document.cookie = `${tokenName}=; Max-Age=0; path=/; domain=${window.location.hostname};`;
      });

      updateUser(null);
      alert("Your account has been deleted successfully.");
      navigate("/");
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
