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
    await logActivity(
      newUser,
      "Created account",
      `User registered at ${timestamp}`
    );

    return sendSuccess(res, { message: "Signup successful" }, 201);
  } catch (error) {
    sendError(res, "Failed to sign up", 500, error);
  }
};
