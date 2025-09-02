import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // ovde ide tvoja db konekcija
import {
  sendSuccess,
  sendError,
  sendUnauthorized,
  sendForbidden,
} from "../utils/httpResponses.js";
import { logActivity } from "../utils/logActivity.js";

const generateToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = result[0];
    if (!user) return sendUnauthorized(res, "Invalid username or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendUnauthorized(res, "Invalid username or password");

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      accessToken,
      user: { id: user.id, username: user.username, fullName: user.fullName },
    });
  } catch (err) {
    sendError(res, "Error logging in", 500, err);
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return sendUnauthorized(res, "Refresh token not provided");

  jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return sendForbidden(res, "Invalid refresh token");
    const accessToken = generateToken(
      { userId: user.userId },
      process.env.SECRET_KEY,
      "15m"
    );
    sendSuccess(res, { accessToken });
  });
};

export const signup = async (req, res) => {
  const {
    username,
    userEmail,
    password,
    fullName,
    userAddress,
    userPhoneNumber,
  } = req.body;
  if (
    !username ||
    !userEmail ||
    !password ||
    !fullName ||
    !userAddress ||
    !userPhoneNumber
  ) {
    return sendError(res, "All fields are required.", 400);
  }

  try {
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

    sendSuccess(res, { message: "Signup successful" }, 201);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("users.username"))
        return sendError(res, "Username already exists.", 409);
      if (err.sqlMessage.includes("users.email"))
        return sendError(res, "Email already registered.", 409);
      return sendError(res, "Duplicate entry in database.", 409);
    }
    sendError(res, "Failed to sign up", 500, err);
  }
};
