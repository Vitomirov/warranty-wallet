import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";
import useSecureRequest from "./useSecureRequest";

const useMyAccount = () => {
  const { updateUser } = useAuth();
  const { secureRequest } = useSecureRequest();

  const [userData, setUserData] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    userAddress: "",
    userPhoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await secureRequest("get", "/me");
      if (response?.data) {
        setUserData({
          username: response.data.username || "",
          userEmail: response.data.userEmail || "",
          password: "",
          fullName: response.data.fullName || "",
          userAddress: response.data.userAddress || "",
          userPhoneNumber: response.data.userPhoneNumber || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error fetching user data."
      );
    } finally {
      setLoading(false);
    }
  }, [secureRequest]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setSuccessMessage("");
      setError(null);

      try {
        await secureRequest("put", "/me", userData);
        setSuccessMessage("Account information updated successfully.");

        // Refresh context
        const response = await secureRequest("get", "/me");
        updateUser(response.data);
      } catch (err) {
        console.error("Error updating account information:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error updating account information."
        );
      }
    },
    [userData, secureRequest, updateUser]
  );

  return {
    userData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleUpdate,
  };
};

export default useMyAccount;
