import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import LayoutWithNav from './components/LayoutWithNav';
import LayoutWithoutNav from './components/LayoutWithoutNav';
import NewWarranty from './components/NewWarranty';
import WarrantyDetails from './components/WarrantyDetails';
import MyWarranties from './components/MyWarranties';
import LogOut from './components/LogOut';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/AuthProvider';

function App() {
  console.log('Rendering App component');


  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LayoutWithoutNav><Home /></LayoutWithoutNav>} />
        <Route path="/login" element={<LayoutWithoutNav><LogIn /></LayoutWithoutNav>} />
        <Route path="/signup" element={<LayoutWithoutNav><SignUp /></LayoutWithoutNav>} />
        <Route path="/logout" element={<LayoutWithNav><LogOut /></LayoutWithNav>} />
        <Route path="/dashboard" element={
           <PrivateRoute>
            <LayoutWithoutNav><Dashboard /></LayoutWithoutNav>
          </PrivateRoute> 
        } />
        <Route path="/newWarranty" element={
          <PrivateRoute>
            <LayoutWithoutNav><NewWarranty /></LayoutWithoutNav>
          </PrivateRoute>
        } />
        <Route path="/warranty/:id" element={
          <PrivateRoute>
            <LayoutWithoutNav><WarrantyDetails /></LayoutWithoutNav>
          </PrivateRoute>
        } />
        <Route path="/myWarranties" element={
          <PrivateRoute>
            <LayoutWithoutNav><MyWarranties /></LayoutWithoutNav>
          </PrivateRoute>
          } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
