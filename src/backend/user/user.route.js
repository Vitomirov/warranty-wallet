import express from "express";
import { verifyToken } from "../auth/auth.middleware.js";
import { getMe, updateMe, deleteMe } from "./user.controller.js";

const router = express.Router();

// Get user data
router.get("/me", verifyToken, getMe);

// Update user data
router.put("/me", verifyToken, updateMe);

// Delete user account
router.delete("/me", verifyToken, deleteMe);

export default router;
