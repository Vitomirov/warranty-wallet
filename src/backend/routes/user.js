import express from 'express';
import { verifyToken } from './auth.functions.js';
import connection from '../db.js';

const router = express.Router();

// Get user data
router.get('/me', verifyToken, (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    console.log('User  ID from token:', userId);
    
    const sql = 'SELECT fullName, userAddress, userPhoneNumber FROM users WHERE id = ?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ message: 'Error fetching user data' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result[0]); // Return the user data
    });
});

// Update user data
router.put('/me', verifyToken, (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    const { fullName, userAddress, userPhoneNumber } = req.body;

    const sql = 'UPDATE users SET fullName = ?, userAddress = ?, userPhoneNumber = ? WHERE id = ?';
    connection.query(sql, [fullName, userAddress, userPhoneNumber, userId], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            return res.status(500).json({ message: 'Error updating user data' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User data updated successfully' });
    });
});

export default router;
