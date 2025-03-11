import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { instance } from '../context/AuthProvider';

function DeleteAccount() {
    const { token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // Dodajte stanje za prikaz potvrde

    const handleDeleteAccount = async () => {
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        try {
            await instance.delete('/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            updateUser(null);
            alert('Your account has been deleted successfully.');
            navigate('/');
        } catch (error) {
            if (error.response) {
                console.error('Error deleting account:', error.response.status);
                setError(`Error: ${error.response.data.message || "An error occurred."}`);
            } else {
                console.error('Error deleting account:', error.message);
                setError('Error deleting account.');
            }
        }
    };

    const handleDeleteClick = () => {
        setShowConfirmation(true); 
    };

    return (
        <>
            <button type="button" className="btn btn-secondary" onClick={handleDeleteClick}>Delete Account</button>
            
            {showConfirmation && (
                <div className="alert alert-warning mt-3">
                    <p>Are you sure you want to delete your account? This action cannot be undone and all your warranties will be deleted.</p>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>Yes, delete my account</button>
                    <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>Cancel</button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            )}
        </>
    );
}

export default DeleteAccount;