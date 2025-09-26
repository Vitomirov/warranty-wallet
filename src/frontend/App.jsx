import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/auth/AuthProvider";
import Layout from "./layout/Layout";
import PrivateRoute from "./features/account/PrivateRoute";
import BackToTopButton from "./ui/BackToTopButton";

// Direktni import za landing page → brzi FCP
import LandingPage from "./pages/LandingPage";

// Prefetch ključnih ruta
const LogIn = lazy(() => import("./features/auth/LogIn"));
const SignUp = lazy(() => import("./features/auth/SignUp"));
const Dashboard = lazy(() => import("./features/warranties/Dashboard"));

// Ostale lazy rute
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const FAQ = lazy(() => import("./pages/FAQ"));
const MyAccount = lazy(() => import("./features/account/MyAccount"));
const NewWarranty = lazy(() => import("./features/warranties/NewWarranty"));
const WarrantyDetails = lazy(() =>
  import("./features/warranties/WarrantyDetails")
);
const DeleteWarranty = lazy(() =>
  import("./features/warranties/DeleteWarranty")
);

// AIChat lazy, fallback null → uvek mountovan
const AIChat = lazy(() => import("./features/ai/AiChat"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div
            style={{ height: "100vh", width: "100%", background: "#f0f0f0" }}
          />
        }
      >
        <Routes>
          {/* Public / Marketing */}
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

          {/* Private / App */}
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Suspense fallback={null}>
          <AIChat />
        </Suspense>
        <BackToTopButton />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
