import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import useSecureRequest from "./useSecureRequest";

const useSignUp = () => {
  const { login } = useAuth();
  const { secureRequest } = useSecureRequest();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (userData) => {
    if (loading) return;

    // Validate if all fields are populated
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
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Failed to sign up");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, message, loading };
};

export default useSignUp;
