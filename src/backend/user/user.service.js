// src/backend/user/user.service.js

import db from "../config/db.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { logActivity } from "../core/logActivity.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

export const getUserData = async (userId) => {
  const sql =
    "SELECT username, userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?";
  const [result] = await db.query(sql, [userId]);
  return result[0] || null;
};

export const updateUserData = async (userId, data) => {
  const {
    username,
    userEmail,
    password,
    fullName,
    userAddress,
    userPhoneNumber,
  } = data;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const sql =
    "UPDATE users SET username = ?, userEmail = ?, password = ?, fullName = ?, userAddress = ?, userPhoneNumber = ? WHERE id = ?";
  const [result] = await db.query(sql, [
    username,
    userEmail,
    hashedPassword,
    fullName,
    userAddress,
    userPhoneNumber,
    userId,
  ]);

  if (result.affectedRows > 0) {
    // We are logging activity here as it is part of the business logic
    await logActivity(
      { userId },
      "Updated account",
      `User ${username} updated their account info.`
    );
    return true;
  }
  return false;
};

export const deleteUserAccount = async (user, userId, res) => {
  await logActivity(user, "Deleted account", `User deleted their account.`);

  // Step 1: Fetch and delete all warranty files from disk
  const [warranties] = await db.query(
    "SELECT pdfFilePath FROM warranties WHERE userId = ?",
    [userId]
  );

  warranties.forEach((warranty) => {
    const filePath = path.join(uploadsDir, path.basename(warranty.pdfFilePath));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete file:", filePath, err);
      }
    }
  });

  // Step 2: Delete user's warranties from the database
  await db.query("DELETE FROM warranties WHERE userId = ?", [userId]);

  // Step 3: Delete the user from the database
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

  if (result.affectedRows === 0) {
    return false;
  }

  // Step 4: Clear authentication cookies. We do this here since it is a direct result of deleting the user
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });

  return true;
};
