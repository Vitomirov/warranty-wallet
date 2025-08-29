import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import useSecureRequest from "./useSecureRequest";

const useMyAccount = () => {
  const { token, updateUser } = useAuth();
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

  // Fetches user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const response = await secureRequest("get", "/me");
        if (response.data) {
          setUserData({
            username: response.data.username || "",
            userEmail: response.data.userEmail || "",
            password: "", // Password should not be pre-filled
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
    };
    fetchUser();
  }, [token, secureRequest]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    setSuccessMessage("");
    setError(null);

    try {
      await secureRequest("put", "/me", userData);
      setSuccessMessage("Account information updated successfully.");

      // Re-fetch user data to update the AuthContext
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
  };

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
