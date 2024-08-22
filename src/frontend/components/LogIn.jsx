import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogIn = () => {
  const [username, setUsername] = useState(''); // State to hold the username input value
  const [password, setPassword] = useState(''); // State to hold the password input value
  const { login } = useAuth(); // Extracting the login function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to process the login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    console.log('Form submitted');
    try {
      const response = await login(username, password); // Calls the login function with username and password
      console.log('Response received:', response); // Logs the response from the login function
      console.log('Token stored in localStorage:', localStorage.getItem('authToken')); // Verifies if the token is stored in localStorage
      navigate('/navigation'); // Redirects the user to the navigation page after a successful login
    } catch (error) {
      console.error('Failed to log in', error); // Logs any error that occurs during login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Warranty Wallet</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> {/* Input for username */}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> {/* Input for password */}
      </div>
      <button type="submit">Log In</button> {/* Submit button */}
      <br />
      <Link to="/">Home</Link> {/* Link back to the home page */}
    </form>
  );
};

export default LogIn;
