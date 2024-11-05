import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SignUp() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        username,
        userEmail,
        password,
        fullName,
        userAddress,
        userPhoneNumber
      });
      setMessage(response.data);
      setUsername('');
      setUserEmail('');
      setPassword('');
      setFullName('');
      setUserAddress('');
      setUserPhoneNumber('');
      navigate('/login');
    } catch (error) {
      setMessage('Failed to sign up');
    }
  };

  return (
    <>
      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
  
        <fieldset>
          <legend>Account Information</legend>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a unique username"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="example@domain.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              required
            />
          </div>
        </fieldset>
  
        <fieldset>
          <legend>Personal Information</legend>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="1234 Main St, City, Country"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              type="tel"
              value={userPhoneNumber}
              onChange={(e) => setUserPhoneNumber(e.target.value)}
              placeholder="+1 234 567 890"
              required
            />
          </div>
        </fieldset>
  
        <button type="submit">Sign Up</button>
      </form>
      
      <br />
      <Link to="/">Home</Link>
    </>
  );  
}

export default SignUp;