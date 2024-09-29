import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../db.js';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Function to verify JWT token
export const verifyToken = (req, res, next) => {
  console.log('Verifying token...');
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  const token = authHeader.substring(7); // Extract the token from the Authorization header

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    console.log('Token verified successfully');
    req.user = user;
    next();
  });
};

// Function to login and provide access and refresh tokens
export const login = async (req, res) => {
  console.log('LogIn route reached');

  const { username, password } = req.body;
  console.log('Login attempt with:', username); 
  
  const sql = 'SELECT * FROM users WHERE username = ?';
  
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).send({ message: 'Error logging in', error: err.message });
    }
    console.log('Query result:', result);
    if (result.length === 0) {
      console.log('No user found with username:', username); 
      return res.status(401).send('Invalid username or password');
    }
    
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      console.log('Password match, generating tokens');

      const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'strict'
      })
        .header('Authorization', accessToken)
        .status(200)
        .json({
          accessToken,
          refreshToken,
          user: { id: user.id, username: user.username }
        });

    } else {
      console.log('Password mismatch for user:', username);
      return res.status(401).send('Invalid username or password');
    }
  });
};

// Function to refresh access token using refresh token from cookie
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying refresh token:', err);
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '15m' });

    res.json({ accessToken });
  });
};

// Function to signup a new user
export const signup = async (req, res) => {
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
};