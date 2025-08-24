import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import MyAccount from "./components/MyAccount";
import Dashboard from "./components/Dashboard";
import NewWarranty from "./components/NewWarranty";
import WarrantyDetails from "./components/WarrantyDetails";
import DeleteWarranty from "./components/DeleteWarranty";
import LogOut from "./components/LogOut";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./context/AuthProvider";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import AIChat from "./components/AiChat";
import Layout from "./components/Layout";

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
