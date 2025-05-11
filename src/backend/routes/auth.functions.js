import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";
import {
  sendSuccess,
  sendError,
  sendUnauthorized,
  sendForbidden,
} from "./utils/httpResponses.js";
import { logActivity } from "./utils/logActivity.js";

dotenv.config();

// Generate JWT tokens
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Middleware function to verify JWT access token from the Authorization header
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendUnauthorized(res, "Invalid Token!");
  }

  const token = authHeader.substring(7);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return sendForbidden(res, "Token is invalid or expired");
    }
    req.user = user; // Attach the decoded user payload to the request
    next(); // Proceed to the next middleware/route
  });
};

// Handles user login, verifies password, generates and returns tokens
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username in the database
    const [result] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (result.length === 0) {
      return sendUnauthorized(res, "Invalid username or password"); // Use helper
    }
    const user = result[0];
    // Compare provided password with hashed password from DB
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return sendUnauthorized(res, "Invalid username or password");
    }
    // Generate access and refresh tokens using the helper function
    const accessToken = generateToken(
      { userId: user.id },
      process.env.SECRET_KEY,
      "15m"
    );
    const refreshToken = generateToken(
      { userId: user.id },
      process.env.REFRESH_SECRET_KEY,
      "7d"
    );
    // Set the refresh token as an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure: true only in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in miliseconds, matches refresh token expiry
    });

    // Send the access token and user info in the response
    sendSuccess(res, {
      accessToken,
      user: { id: user.id, username: user.username, fullName: user.fullName },
    });
  } catch (err) {
    // Handle server errors during login
    sendError(res, "Error logging in", 500, err);
  }
};

// Handles refreshing the access token using the refresh token from cookies
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return sendUnauthorized(res, "Refresh token not provided");
  } // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return sendForbidden(res, "Invalid refresh token");
    }

    // Generate a new access token using the helper function
    const accessToken = generateToken(
      { userId: user.userId },
      process.env.SECRET_KEY,
      "15m"
    );

    // Send the new access token
    sendSuccess(res, { accessToken });
  });
};

// Handles new user registration (signup)
export const signup = async (req, res) => {
  const {
    username,
    userEmail,
    password,
    fullName,
    userAddress,
    userPhoneNumber,
  } = req.body;

  // Check if all required fields are provided
  if (!username || !userEmail || !password || !fullName || !userAddress || !userPhoneNumber) {
    // Use your sendError function to return a missing fields error
    // Added check for sendError function existence
    if (typeof sendError === 'function') {
        return sendError(res, "All fields are required.", 400);
    } else {
        console.error("sendError function not found. Cannot send 400 response.");
        return res.status(400).json({ error: "All fields are required." });
    }
  }

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await db.query(
      "INSERT INTO users (username, userEmail, password, fullName, userAddress, userPhoneNumber) VALUES (?, ?, ?, ?, ?, ?)",
      [
        username,
        userEmail,
        hashedPassword,
        fullName,
        userAddress,
        userPhoneNumber,
      ]
    );

    const userId = result.insertId;

    // Manually construct user object for logging
    const newUser = {
      userId,
      username,
      fullName,
    };

    // Get current date and time
    const timestamp = new Date().toISOString();

    // Log activity
    // Added check for logActivity function existence
    if (typeof logActivity === 'function') {
        await logActivity(
            newUser,
            "Created account",
            `User registered at ${timestamp}`
        );
    } else {
        console.warn("logActivity function not found, skipping activity logging.");
    }


    // Successful registration - use your sendSuccess function
    // Added check for sendSuccess function existence
    if (typeof sendSuccess === 'function') {
        return sendSuccess(res, { message: "Signup successful" }, 201);
    } else {
        console.warn("sendSuccess function not found. Cannot send 201 response.");
        return res.status(201).json({ message: "Signup successful" });
    }


  } catch (error) { // <--- Single, correctly connected catch block
    console.error('API Error: Failed to sign up', error); // Log the error on the backend

    // CHECK FOR SPECIFIC DATABASE ERROR (DUPLICATE ENTRY)
    // Error code 'ER_DUP_ENTRY' (1062) indicates a UNIQUE constraint violation
    if (error.code === 'ER_DUP_ENTRY') {
      // Check if the duplicate is username or email based on the database error message
      if (error.sqlMessage.includes('users.username')) {
        // Return 409 Conflict for duplicate username - use your sendError function
         if (typeof sendError === 'function') {
            return sendError(res, 'Username already exists.', 409);
         } else {
            console.error("sendError function not found. Cannot send 409 response.");
            return res.status(409).json({ error: 'Username already exists.' });
         }
      }
      if (error.sqlMessage.includes('users.email')) {
         // Return 409 Conflict for duplicate email - use your sendError function
         if (typeof sendError === 'function') {
            return sendError(res, 'Email already registered.', 409);
         } else {
            console.error("sendError function not found. Cannot send 409 response.");
            return res.status(409).json({ error: 'Email already registered.' });
         }
      }
      // If it's a duplicate, but not username or email (less likely, e.g., another unique constraint)
      // Return a generic 409 for unknown duplicate - use your sendError function
       if (typeof sendError === 'function') {
            return sendError(res, 'Duplicate entry in database.', 409);
         } else {
            console.error("sendError function not found. Cannot send 409 response.");
            return res.status(409).json({ error: 'Duplicate entry in database.' });
         }
    }

    // If the error is not a duplicate entry error (e.g., connection error, SQL syntax error, etc.)
    // Return a generic 500 Internal Server Error - use your sendError function
     if (typeof sendError === 'function') {
        sendError(res, "Failed to sign up", 500, error);
     } else {
        console.error("sendError function not found. Cannot send 500 response.");
        res.status(500).json({ error: "Failed to sign up", details: error.message });
     }
  }
};
