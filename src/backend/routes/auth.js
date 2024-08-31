import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../db.js';

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user;
    console.log('Token verified successfully:', user);
    next();
  });
};

// Route to login and provide access and refresh tokens
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const sql = 'SELECT * FROM users WHERE username = ?';
  
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).send('Error logging in');
    }
    if (result.length === 0) {
      return res.status(401).send('Invalid username or password');
    }
    
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '15m' }); // Shorter expiration for security
      const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' }); // Longer expiration for refresh token

      console.log('Generated Access Token:', accessToken); 
      console.log('Generated Refresh Token:', refreshToken); 

      res.status(200).json({ accessToken, refreshToken });
    } else {
      return res.status(401).send('Invalid username or password');
    }
  });
});

// Route to signup a new user
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    connection.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        return res.status(500).send('Failed to sign up');
      }
      
      return res.status(200).send('Signup successful');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send('Failed to sign up');
  }
});

// Route to verify access token
router.get('/verifyToken', verifyToken, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });  // Return user data
  } else {
    res.status(401).json({ message: 'No user data found' });
  }
});

// Route to refresh access token using refresh token
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying refresh token:', err);
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '15m' }); // Generate a new access token

    res.json({ accessToken });
  });
});

export default router;
