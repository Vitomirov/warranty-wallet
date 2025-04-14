import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { instance } from '../context/AuthProvider';
import DeleteAccount from "./DeleteAccount";


function MyAccount() {
    const { token, updateUser  } = useAuth(); // Get the token and updateUser from the AuthContext
    console.log("Token being sent:", token);
    const [userData, setUser] = useState({
        username: '',
        userEmail: '',
        password: '',
        fullName: '',
        userAddress: '',
        userPhoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser  = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setError("No token found, please log in.");
                    setLoading(false);
                    return;
                }
                console.log("Token being sent:", token);

                const response = await instance.get('/api/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Fetched user data:", response.data);
                if (response.data) {
                    setUser({
                        username: response.data.username || '',
                        userEmail: response.data.userEmail || '',
                        password: '',
                        fullName: response.data.fullName || '',
                        userAddress: response.data.userAddress || '',
                        userPhoneNumber: response.data.userPhoneNumber || ''
                    });
                }
            } catch (error) {
                if (error.response) {
                    console.error("Error fetching user data:", error.response.status);
                    setError(`Error: ${error.response.data.message || "An error occurred."}`);
                } else {
                    console.error("Error fetching user data:", error.message);
                    setError("Error fetching user data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser ();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser ((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        try {
            await instance.put('/api/me', userData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccessMessage('Account information updated successfully.');
            setError(null);
            
            // Fetch updated user data
            const response = await instance.get('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            updateUser (response.data); // Call updateUser  to update context with new user data
        } catch (error) {
            if (error.response) {
                console.error('Error updating account information:', error.response.status);
                setError(`Error: ${error.response.data.message || "An error occurred."}`);
            } else {
                console.error('Error updating account information:', error.message);
                setError('Error updating account information.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="myAccount container-fluid p-4" style={{ minHeight: '80vh' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <form onSubmit={handleUpdate} className="w-100">
            <div className="d-flex flex-column align-items-center">
              <div className='col-lg-12'>
                <div className="col lg 12 mb-1">
                <h1 className='montserrat'>My Account</h1>
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
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="d-flex mb-2 align-items-center">
                  <label htmlFor="userEmail" className="me-2" style={{ width: '35%' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="d-flex mb-2 align-items-center">
                  <label htmlFor="password" className="me-2" style={{ width: '35%' }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
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
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="d-flex mb-2 align-items-center">
                  <label htmlFor="userAddress" className="me-2" style={{ width: '35%' }}>
                    Address:
                  </label>
                  <input
                    type="text"
                    id="userAddress"
                    name="userAddress"
                    value={userData.userAddress}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="d-flex mb-2 align-items-center">
                  <label htmlFor="userPhoneNumber" className="me-2" style={{ width: '35%' }}>
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="userPhoneNumber"
                    name="userPhoneNumber"
                    value={userData.userPhoneNumber}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </fieldset>
    
              {/* Buttons */}
              <div className="button col-12 col-sm-10 col-md-8 col-lg-5 d-flex justify-content-between mt-3 gap-1">
                <button type="submit" className="btn btn-primary">
                  Update Account
                </button>
                <DeleteAccount />
                <Link to="/dashboard" className="btn btn-secondary">
                  Back
                </Link>
              </div>    
              {successMessage && <p className="text-success mt-2">{successMessage}</p>}
            </div>
          </form>
          </div>
        </div>
    );
}

export default MyAccount;