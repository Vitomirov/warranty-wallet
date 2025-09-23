import React from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/auth/AuthProvider";

// Glavne komponente koje se uvek ucitavaju (Layout i PrivateRoute)
import Layout from "./layout/Layout";
import PrivateRoute from "./features/account/PrivateRoute";

// Odlozeno ucitavanje za sve rute
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LogIn = lazy(() => import("./features/auth/LogIn"));
const SignUp = lazy(() => import("./features/auth/SignUp"));
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Dashboard = lazy(() => import("./features/warranties/Dashboard"));
const MyAccount = lazy(() => import("./features/account/MyAccount"));
const NewWarranty = lazy(() => import("./features/warranties/NewWarranty"));
const WarrantyDetails = lazy(() =>
  import("./features/warranties/WarrantyDetails")
);
const DeleteWarranty = lazy(() =>
  import("./features/warranties/DeleteWarranty")
);
const AIChat = lazy(() => import("./features/ai/AiChat"));

function App() {
  console.log("Rendering App component");

  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </AuthProvider>
  );
}

export default App;
