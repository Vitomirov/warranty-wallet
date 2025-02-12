import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db.js';

dotenv.config();

// Function to verify JWT token
export const verifyToken = (req, res, next) => {
  console.log('Verifying token...');
  
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid Token!' });
  }

  const token = authHeader.substring(7);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }
    req.user = user;
    next();
  });
};

// Log in function
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
      .status(200).json({ accessToken, user: { id: user.id, username: user.username, fullName: user.fullName } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Function to refresh access token
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }
  
  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '15m' });
    res.json({ accessToken });
  });
};

// Function to signup a new user
export const signup = async (req, res) => {
  const { username, userEmail, password, fullName, userAddress, userPhoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, userEmail, password, fullName, userAddress, userPhoneNumber) VALUES (?, ?, ?, ?, ?, ?)', 
      [username, userEmail, hashedPassword, fullName, userAddress, userPhoneNumber]);
    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign up', error: error.message });
  }
};