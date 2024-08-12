import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Function to process the login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    try {
      const response = await login(username, password);
      console.log('Response received:', response);
      navigate('/navigation'); // Redirection to navigation after successful login
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Warranty Wallet</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <button type="submit">Log In</button>
      <br />
      <Link to="/">Home</Link>
    </form>
  );
};

export default LogIn;
