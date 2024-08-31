import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogIn = () => {
  const [username, setUsername] = useState(''); // State to hold the username input value
  const [password, setPassword] = useState(''); // State to hold the password input value
  const { login } = useAuth(); // Extracting the login function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await login(username, password); // Call login function from AuthContext

      if (response.data && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken); // Store access token in localStorage
        localStorage.setItem('refreshToken', response.data.refreshToken); // Store refresh token in localStorage
        console.log('Access Token stored in localStorage:', localStorage.getItem('accessToken'));
        console.log('Refresh Token stored in localStorage:', localStorage.getItem('refreshToken'));
        navigate('/'); // Redirect to home page
      } else {
        console.error('Tokens not found in response'); // Log an error if tokens are missing
      }
    } catch (error) {
      console.error('Failed to log in:', error); // Log any errors during login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Warranty Wallet</h1>
      <div>
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} // Update username state on input change
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
        />
      </div>
      <button type="submit">Log In</button> {/* Submit button */}
      <br />
      <Link to="/">Home</Link> {/* Link back to the home page */}
    </form>
  );
};

export default LogIn;
