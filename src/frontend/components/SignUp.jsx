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
        userPhoneNumber,
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
    <div className="signup container-fluid p-4">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column align-items-center">
          <div className='col-lg-12'>
          <div className="col-lg-3">
            <h1 className='montserrat'>Sign Up</h1>
            </div>
          </div>
          
          {/* Account Information */}
          <fieldset className="mb-1 col-lg-5">
            <legend>Account Information</legend>
            <div className=" d-flex mb-2 align-items-center">
              <label htmlFor="username" className="me-2" style={{ width: '35%' }}>
                Username:
              </label>
              <input
                id="username"
                type="text"
                className="form-control form-control-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="d-flex mb-2 align-items-center">
              <label htmlFor="email" className="me-2" style={{ width: '35%' }}>
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-control-sm"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="d-flex mb-2 align-items-center">
              <label htmlFor="password" className="me-2" style={{ width: '35%' }}>
                Password:
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-control-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </fieldset>

          {/* Personal Information */}
          <fieldset className="mt-5 col-lg-5">
            <legend>Personal Information</legend>
            <div className="d-flex mb-2 align-items-center">
              <label htmlFor="fullName" className="me-2" style={{ width: '35%' }}>
                Full Name:
              </label>
              <input
                id="fullName"
                type="text"
                className="form-control form-control-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="d-flex mb-2 align-items-center">
              <label htmlFor="address" className="me-2" style={{ width: '35%' }}>
                Address:
              </label>
              <input
                id="address"
                type="text"
                className="form-control form-control-sm"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="Address"
                required
              />
            </div>
            <div className="d-flex mb-2 align-items-center">
              <label htmlFor="phoneNumber" className="me-2" style={{ width: '35%' }}>
                Phone:
              </label>
              <input
                id="phoneNumber"
                type="tel"
                className="form-control form-control-sm"
                value={userPhoneNumber}
                onChange={(e) => setUserPhoneNumber(e.target.value)}
                placeholder="Phone"
                required
              />
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="button col-lg-5 d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
            <Link to="/" className="btn btn-secondary">
              Home
            </Link>
          </div>

        </div>
      </form>
    </div>
  );
}

export default SignUp;
