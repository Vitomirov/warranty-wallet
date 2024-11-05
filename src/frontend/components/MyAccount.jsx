import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

function MyAccount() {
    const { token } = useAuth(); // Get the token from the AuthContext
    const [userData, setUser] = useState({
        fullName: '',
        userAddress: '',
        userPhoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setError("No token found, please log in.");
                    setLoading(false);
                    return;
                }
                console.log("Token being sent:", token);

                const response = await axios.get('http://localhost:3000/me', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Use token here
                    }
                });
                console.log("Fetched user data:", response.data); // Log the fetched data
                // Update state with fetched user data
                if (response.data) {
                    setUser({
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
        fetchUser();
    }, [token]); // Include token in dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevData) => ({
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
            await axios.put('http://localhost:3000/me', userData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccessMessage('Account information updated successfully.');
            setError(null);
            // Optionally fetch user data again to ensure it's up-to-date
            // fetchUser Data(); // Uncomment this line if you want to refresh data after update
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
        <form onSubmit={handleUpdate}>
            <div>
                <label htmlFor="fullName">Full Name:</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName} // Display current full name
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                />
            </div>
            <div>
                <label htmlFor="userAddress">Address:</label>
                <input
                    type="text"
                    id="userAddress"
                    name="userAddress"
                    value={userData.userAddress} // Display current address
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                />
            </div>
            <div>
                <label htmlFor="userPhoneNumber">Phone Number:</label>
                <input
                    type="text"
                    id="userPhoneNumber"
                    name="userPhoneNumber"
                    value={userData.userPhoneNumber} // Display current phone number
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                />
            </div>
            <button type="submit">Update Account</button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
}

export default MyAccount;