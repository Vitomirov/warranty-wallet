import express from 'express';
import { verifyToken } from './auth.functions.js';
import db from '../db.js';
import bcrypt from 'bcryptjs'; 

const router = express.Router();

// Get user data
router.get('/me', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    console.log('User  ID from token:', userId);
    
    const sql = 'SELECT username, userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?';
    console.log('Executing SQL:', sql, 'with userId:', userId);
    
    try {
        const [result] = await db.query(sql, [userId]); // Use await for the query
        console.log('Query Result:', result); 
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'User  not found' });
        }
        
        res.json(result[0]); // Return the user data
    } catch (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Error fetching user data', error: err.message });
    }
});

// Update user data
router.put('/me', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Retrieved from the token
    const { username, userEmail, password, fullName, userAddress, userPhoneNumber } = req.body;

    try {
        // Hash the password if it's provided
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const sql = 'UPDATE users SET username = ?, userEmail = ?, password = ?, fullName = ?, userAddress = ?, userPhoneNumber = ? WHERE id = ?';
        
        // Use await for the query
        const [result] = await db.query(sql, [username, userEmail, hashedPassword, fullName, userAddress, userPhoneNumber, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User  not found' });
        }

        res.json({ message: 'User  data updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).json({ message: 'Error updating user data' });
    }
});

// Delete user account
router.delete('/me', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Retrieved from the token

    try {
        // Delete user's warranties
        await db.query('DELETE FROM warranties WHERE userId = ?', [userId]);

        // Now delete the user
        const sql = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(sql, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User  not found' });
        }

                // Clear tokens from cookies
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    path: '/',
                });
        
                res.clearCookie('accessToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    path: '/',
                });

        res.json({ message: 'User  account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        return res.status(500).json({ message: 'Error deleting user account' });
    }
});

export default router;