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
      <Routes>
        {/* Public / Marketing routes (for guests) */}
        <Route
          path="/"
          element={
            <Layout isApp={false}>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout isApp={false}>
              <LogIn />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout isApp={false}>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout isApp={false}>
              <About />
            </Layout>
          }
        />
        <Route
          path="/features"
          element={
            <Layout isApp={false}>
              <Features />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout isApp={false}>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/logout"
          element={
            <Layout isApp={false}>
              <LogOut />
            </Layout>
          }
        />

        {/* Private / App routes (for logged users) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout isApp={true}>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/myAccount"
          element={
            <PrivateRoute>
              <Layout isApp={false}>
                <MyAccount />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/newWarranty"
          element={
            <PrivateRoute>
              <Layout isApp={true}>
                <NewWarranty />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/warranties/details/:id"
          element={
            <PrivateRoute>
              <Layout isApp={true}>
                <WarrantyDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/warranties/delete/:id"
          element={
            <PrivateRoute>
              <Layout isApp={true}>
                <DeleteWarranty />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Default catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChat />
    </AuthProvider>
  );
}

export default App;
