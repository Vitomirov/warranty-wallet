import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import SignUp from "./features/auth/SignUp";
import MyAccount from "./features/account/MyAccount";
import Dashboard from "./features/warranties/Dashboard";
import NewWarranty from "./features/warranties/NewWarranty";
import WarrantyDetails from "./features/warranties/WarrantyDetails";
import DeleteWarranty from "./features/warranties/DeleteWarranty";
import LogOut from "./features/auth/LogOut";
import PrivateRoute from "./features/account/PrivateRoute";
import AuthProvider from "./context/auth/AuthProvider";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Features from "./pages/Features";
import FAQ from "./pages/FAQ";
import AIChat from "./features/ai/AiChat";
import Layout from "./layout/Layout";

function App() {
  console.log("Rendering App component");

  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/logout" element={<LogOut />} />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/myAccount"
            element={
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/newWarranty"
            element={
              <PrivateRoute>
                <NewWarranty />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranties/details/:id"
            element={
              <PrivateRoute>
                <WarrantyDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranties/delete/:id"
            element={
              <PrivateRoute>
                <DeleteWarranty />
              </PrivateRoute>
            }
          />

          {/* Default catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <AIChat />
    </AuthProvider>
  );
}

export default App;
