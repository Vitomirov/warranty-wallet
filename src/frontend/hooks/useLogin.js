import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for handling the user login process.
 * It manages form state, login logic, and navigation.
 */
const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  /**
   * Handles the form submission for user login.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await login(username, password);
      if (response && response.accessToken) {
        navigate("/dashboard");
      } else {
        setError("Login failed: The server response was unexpected.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: Wrong username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCancel = () => navigate("/");

  return {
    username,
    password,
    error,
    loading,
    showLoginModal,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleCancel,
  };
};

export default useLogin;
