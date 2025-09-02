import express from "express";
import { verifyToken } from "./auth.functions.js";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { logActivity } from "../utils/logActivity.js";
import fs from "fs";

const router = express.Router();

// Get user data
router.get("/me", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [result] = await db.query(
      "SELECT username, userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching user data", error: err.message });
  }
});

// Update user data
router.put("/me", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const {
    username,
    userEmail,
    password,
    fullName,
    userAddress,
    userPhoneNumber,
  } = req.body;

  try {
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.query(
      "UPDATE users SET username = ?, userEmail = ?, password = ?, fullName = ?, userAddress = ?, userPhoneNumber = ? WHERE id = ?",
      [
        username,
        userEmail,
        hashedPassword,
        fullName,
        userAddress,
        userPhoneNumber,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log user update
    await logActivity(
      req.user,
      "Updated account",
      `User ${username} updated their account info.`
    );

    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ message: "Error updating user data" });
  }
});

// Delete user account
router.delete("/me", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Log user activity before deletion
    await logActivity(
      req.user,
      "Deleted account",
      `User deleted their account.`
    );

    // Step 1: Fetch all warranty file paths for the user
    const [warranties] = await db.query(
      "SELECT pdfFilePath FROM warranties WHERE userId = ?",
      [userId]
    );

    // Step 2: Delete each file from the disk
    warranties.forEach((warranty) => {
      const filePath = warranty.pdfFilePath;
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath); // Delete file synchronously
          console.log("Deleted file:", filePath);
        } catch (err) {
          console.error("Failed to delete file:", filePath, err);
        }
      }
    });

    // Step 3: Delete user's warranties from the database
    await db.query("DELETE FROM warranties WHERE userId = ?", [userId]);

    // Step 4: Delete the user from the database
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 5: Clear authentication cookies
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

    // Step 6: Respond with success
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res.status(500).json({ message: "Error deleting user account" });
  }
});

export default router;
