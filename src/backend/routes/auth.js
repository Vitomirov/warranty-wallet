import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../db.js';

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
console.log("SECRET_KEY:", SECRET_KEY);

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
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      console.log('Generated Token:', token); // Ovaj console.log dodaješ da vidiš generisani token
      res.status(200).json({ token });
    } else {
      return res.status(401).send('Invalid username or password');
    }
  });
});

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

// Route to verify token
router.get('/verifyToken', verifyToken, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });  // Vrati podatke o korisniku
  } else {
    res.status(401).json({ message: 'No user data found' });
  }
});

export default router;
