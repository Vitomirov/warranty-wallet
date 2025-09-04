// src/backend/user/user.controller.js

import { sendSuccess, sendError, sendNotFound } from "../core/httpResponses.js";
import {
  getUserData,
  updateUserData,
  deleteUserAccount,
} from "./user.service.js";

export const getMe = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await getUserData(userId);
    if (!user) {
      return sendNotFound(res, "User not found");
    }
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, "Error fetching user data", 500, err);
  }
};

export const updateMe = async (req, res) => {
  const { userId } = req.user;
  const { body } = req;
  try {
    const updated = await updateUserData(userId, body);
    if (!updated) {
      return sendNotFound(res, "User not found");
    }
    sendSuccess(res, { message: "User data updated successfully" });
  } catch (err) {
    sendError(res, "Error updating user data", 500, err);
  }
};

export const deleteMe = async (req, res) => {
  const { userId } = req.user;
  const user = req.user;
  try {
    const deleted = await deleteUserAccount(user, userId, res);
    if (!deleted) {
      return sendNotFound(res, "User not found or nothing was deleted");
    }
    sendSuccess(res, { message: "User account deleted successfully" });
  } catch (err) {
    sendError(res, "Error deleting user account", 500, err);
  }
};
