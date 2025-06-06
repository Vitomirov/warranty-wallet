import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSecureRequest from '../hooks/useSecureRequest';

function SignUp() {
  const { login } = useAuth(); // Use login function from AuthContext
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { secureRequest } = useSecureRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
if (
  !username ||
  !userEmail ||
  !password ||
  !fullName ||
  !userAddress ||
  !userPhoneNumber
) {
  setMessage("Please populate all fields.");
  return;
}


    try {
      // Make the signup request
      const response = await secureRequest('post','/signup', {
        username,
        userEmail,
        password,
        fullName,
        userAddress,
        userPhoneNumber,
      });

      // Check if signup was successful
      if (response.data) {
        setMessage('Signup successful! Logging you in...');        
        await login(username, password);
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage('Failed to sign up');
      console.error(error);
    }
  };

  return (
    <div className="signup container-fluid p-4" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <form onSubmit={handleSubmit} className="w-100">
          <div className="d-flex flex-column align-items-center">
            <div className='col-lg-12'>
              <div className="col-lg-3 mb-1">
                <h1 className='montserrat'>Sign Up</h1>
              </div>
            </div>
  
            {/* Account Information */}
            <fieldset className="mb-1 col-12 col-sm-10 col-md-8 col-lg-5">
              <legend>Account Information</legend>
              <div className="d-flex mb-2 align-items-center">
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
            <fieldset className="mt-5 mb-3 col-12 col-sm-10 col-md-8 col-lg-5">
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
            <div className="button col-12 col-sm-10 col-md-8 col-lg-5 d-flex justify-content-between mt-3 gap-1">
              < button type="submit" className="btn btn-primary mb-2 mb-sm-0">
                Sign Up
              </button>
              <Link to="/" className="btn btn-primary mb-2 mb-sm-0">
                Home
              </Link>
            </div>
          </div>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUp;
