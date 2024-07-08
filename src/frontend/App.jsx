import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Navigation from './components/Navigation';
import NewWarranty from './components/NewWarranty';
import WarrantyDetails from './components/WarrantyDetails';
import LogOut from './components/LogOut';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { user } = useAuth();
  return user ? <Element {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/newWarranty" element={<PrivateRoute element={NewWarranty} />} />
          <Route path="/warranty/:id" element={<PrivateRoute element={WarrantyDetails} />} />
          <Route path="/logout" element={<LogOut />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;
