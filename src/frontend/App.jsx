import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import MyAccount from './components/MyAccount';
import Dashboard from './components/Dashboard';
import NewWarranty from './components/NewWarranty';
import WarrantyDetails from './components/WarrantyDetails';
import DeleteWarranty from './components/DeleteWarranty';
import MyWarranties from './components/MyWarranties';
import LogOut from './components/LogOut';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/AuthProvider';
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import About from './components/About';
import LayoutWithoutHeader from './components/LayoutWithoutHeader'; 


function App() {
  console.log('Rendering App component');

  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Other Pages Wrapped in LayoutWithoutHeader */}
        <Route path="/login" element={<LayoutWithoutHeader><LogIn /></LayoutWithoutHeader>} />
        <Route path="/signup" element={<LayoutWithoutHeader><SignUp /></LayoutWithoutHeader>} />
        <Route path="/about" element={<LayoutWithoutHeader><About /></LayoutWithoutHeader>} />
        <Route path="/logout" element={<LayoutWithoutHeader><LogOut /></LayoutWithoutHeader>} />
        <Route path="/dashboard" element={<PrivateRoute><LayoutWithoutHeader><Dashboard /></LayoutWithoutHeader></PrivateRoute>} />
        <Route path="/myAccount" element={<PrivateRoute><LayoutWithoutHeader><MyAccount /></LayoutWithoutHeader></PrivateRoute>} />
        <Route path="/newWarranty" element={<PrivateRoute><LayoutWithoutHeader><NewWarranty /></LayoutWithoutHeader></PrivateRoute>} />
        <Route path="/warranties/details/:id" element={<PrivateRoute><LayoutWithoutHeader><WarrantyDetails /></LayoutWithoutHeader></PrivateRoute>} />
        <Route path="/myWarranties" element={<PrivateRoute><LayoutWithoutHeader><MyWarranties /></LayoutWithoutHeader></PrivateRoute>} />
        <Route path="/warranties/delete/:id" element={<PrivateRoute><LayoutWithoutHeader><DeleteWarranty /></LayoutWithoutHeader></PrivateRoute>} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>


    </AuthProvider>
  );
}

export default App;
