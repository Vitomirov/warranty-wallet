import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../db.js';

dotenv.config();

// Function to verify JWT token
export const verifyToken = (req, res, next) => {
  console.log('Verifying token...');

  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader); // Log the Authorization header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid header format');
    return res.sendStatus(401).json({
      message: 'Invalid Token!'
    }); // Unauthorized if no token is provided
  }

  const token = authHeader.substring(7); // Extract the token from the Authorization header
  console.log('Token:', token); // Log the extracted token

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(401); // Forbidden if token is invalid
    }

    console.log('Token successfully verified. User:', user); // Log the decoded user information
    req.user = user; // Attach the user to the request object
    next(); // Pass to the next middleware or route handler
  });
};

// Log in function
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

      console.log('Generated Access Token:', accessToken);
      console.log('Generated Refresh Token:', refreshToken);

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
          user: {
            id: user.id,
            username: user.username,
            password: user.password,
            fullName: user.fullName,
            userAddress: user.userAddress,
            userPhoneNumber: user.userPhoneNumber
          }
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
  console.log('Received refresh token:', refreshToken); // Log the token

  if (!refreshToken) {
    console.log('No refresh token provided');
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying refresh token:', err.message);
      console.log('Token verification failed. Check if the token is expired or signed with the correct key.');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    console.log('Refresh token verified. User:', user);
    const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '15m' });
    console.log('New Access Token generated:', accessToken);
    res.json({ accessToken });
  });
};
// Function to signup a new user
export const signup = async (req, res) => {
  const { username, userEmail, password, fullName, userAddress, userPhoneNumber } = req.body;
  
  console.log('SignUp route reached with username:', username);
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password for user:', username);
    
    const sql = 'INSERT INTO users (username, userEmail, password, fullName, userAddress, userPhoneNumber) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [username, userEmail, hashedPassword, fullName, userAddress, userPhoneNumber], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        return res.status(500).send('Failed to sign up');
      }
      
      console.log('User  signed up successfully:', username);
      return res.status(200).send('Signup successful');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send('Failed to sign up');
  }
};