import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import MyAccount from './components/MyAccount';
import Dashboard from './components/Dashboard';
import LayoutWithNav from './components/LayoutWithNav';
import LayoutWithoutNav from './components/LayoutWithoutNav';
import NewWarranty from './components/NewWarranty';
import WarrantyDetails from './components/WarrantyDetails';
import DeleteWarranty from './components/DeleteWarranty';
import MyWarranties from './components/MyWarranties';
import LogOut from './components/LogOut';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/AuthProvider';
import About from './components/About';
import LandingPage from './components/LendingPage';


function App() {
  console.log('Rendering App component');

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LayoutWithoutNav><LogIn /></LayoutWithoutNav>} />
        <Route path="/signup" element={<LayoutWithoutNav><SignUp /></LayoutWithoutNav>} />
        <Route path="/logout" element={<LayoutWithNav><LogOut /></LayoutWithNav>} />
        <Route path="/about" element={<LayoutWithoutNav><About /></LayoutWithoutNav>} />
        <Route path="/dashboard" element={
           <PrivateRoute>
            <LayoutWithoutNav><Dashboard /></LayoutWithoutNav>
          </PrivateRoute> 
        } />
        <Route path='/myAccount' element={
          <PrivateRoute>
            <LayoutWithoutNav><MyAccount /></LayoutWithoutNav>
          </PrivateRoute>
        } />
        <Route path="/newWarranty" element={
          <PrivateRoute>
            <LayoutWithoutNav><NewWarranty /></LayoutWithoutNav>
          </PrivateRoute>
        } />
        <Route path="/warranties/details/:id" element={
          <PrivateRoute>
            <LayoutWithoutNav><WarrantyDetails /></LayoutWithoutNav>
          </PrivateRoute>
        } />
        <Route path="/myWarranties" element={
          <PrivateRoute>
            <LayoutWithoutNav><MyWarranties /></LayoutWithoutNav>
          </PrivateRoute>
          } />
        <Route path="/warranties/delete/:id" element={
          <PrivateRoute>
            <LayoutWithoutNav><DeleteWarranty /></LayoutWithoutNav>
          </PrivateRoute>
          } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>  
  );
}

export default App;