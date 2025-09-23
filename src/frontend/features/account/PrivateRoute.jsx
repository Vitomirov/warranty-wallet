import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>Loading...</>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
