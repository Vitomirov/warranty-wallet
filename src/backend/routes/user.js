import express from 'express';
import { verifyToken } from './auth.functions.js';
import db from '../db.js';
import bcrypt from 'bcrypt'; 

const router = express.Router();

// Get user data
router.get('/me', verifyToken, (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    console.log('User  ID from token:', userId);
    
    const sql = 'SELECT username, userEmail, password, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
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
router.put('/me', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    const { username, userEmail, password,
        fullName, userAddress, userPhoneNumber } = req.body;
    
    try {
        // Hash the password if it's provided
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
    

    const sql = 'UPDATE users SET username =  ?, userEmail = ?, password = ?, fullName = ?, userAddress = ?, userPhoneNumber = ? WHERE id = ? ';
    db.query(sql, [username, userEmail, hashedPassword,
                           fullName, userAddress, userPhoneNumber, userId], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            return res.status(500).json({ message: 'Error updating user data' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User data updated successfully' });
    });
    } catch (error) {
        console.error('Error hashing password: ', error);
        return res.status(500).json({ message: 'Error updating user data' });
    }
});

export default router;
