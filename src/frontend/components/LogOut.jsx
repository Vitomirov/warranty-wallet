import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogOut() {
  // Destructure the logout function from the AuthContext to handle user logout
  const { logout } = useAuth();

  // Initialize useNavigate to programmatically navigate the user after logout
  const navigate = useNavigate();

  // Function to handle the logout process when the link is clicked
  const handleLogout = (event) => {
    event.preventDefault(); // Prevents the default link behavior of navigation
    logout(); // Clears the authentication state by logging the user out
    localStorage.removeItem('token'); // Removes the authentication token from localStorage
    navigate('/'); // Redirects the user to the home page after logging out
  };

  return (
    <Link onClick={handleLogout}>Log Out</Link> // Calls handleLogout on click
  );
}

export default LogOut;
