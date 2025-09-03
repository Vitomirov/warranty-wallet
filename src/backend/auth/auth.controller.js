import {
  sendSuccess,
  sendError,
  sendUnauthorized,
  sendForbidden,
} from "../core/httpResponses.js";
import { authService, generateToken } from "./auth.service.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username);

    if (!user) {
      return sendUnauthorized(res, "Invalid username or password");
    }

    const match = await authService.comparePassword(password, user.password);
    if (!match) {
      return sendUnauthorized(res, "Invalid username or password");
    }

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

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return sendUnauthorized(res, "Refresh token not provided");
  }

  try {
    const user = await authService.verifyRefreshToken(token);
    const accessToken = generateToken(
      { userId: user.userId },
      process.env.SECRET_KEY,
      "15m"
    );
    sendSuccess(res, { accessToken });
  } catch (err) {
    return sendForbidden(res, "Invalid refresh token");
  }
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
    const newUser = await authService.signup({
      username,
      userEmail,
      password,
      fullName,
      userAddress,
      userPhoneNumber,
    });
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
