import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { logActivity } from "../core/logActivity.js";

// This function is for generating tokens, which is a core business operation.
export const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// All database interactions and logic for handling authentication should be in the service.
export const authService = {
  login: async (username) => {
    const [result] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return result[0];
  },

  signup: async (userData) => {
    const {
      username,
      userEmail,
      password,
      fullName,
      userAddress,
      userPhoneNumber,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
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

    const newUser = { userId: result.insertId, username, fullName };
    await logActivity(
      newUser,
      "Created account",
      `User registered at ${new Date().toISOString()}`
    );

    return newUser;
  },

  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },

  verifyRefreshToken: async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
          return reject(err);
        }
        resolve(user);
      });
    });
  },
};
