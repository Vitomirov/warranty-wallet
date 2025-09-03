import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "../core/httpResponses.js";
import {
  getAllWarranties,
  getSingleWarranty,
  addNewWarranty,
  deleteSingleWarranty,
  getWarrantyPDFFile,
} from "./warranty.service.js";

export const getWarranties = async (req, res) => {
  try {
    const warranties = await getAllWarranties(req.user.userId);
    sendSuccess(res, warranties);
  } catch (err) {
    sendError(res, "Error fetching warranties", 500, err);
  }
};

export const getWarranty = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const warranty = await getSingleWarranty(userId, id);
    if (!warranty) {
      return sendNotFound(res, "Warranty not found");
    }
    sendSuccess(res, warranty);
  } catch (err) {
    sendError(res, "Error fetching warranty", 500, err);
  }
};

export const addWarranty = async (req, res) => {
  const { body, file, user } = req;
  try {
    const newWarranty = await addNewWarranty(body, file, user);
    sendSuccess(res, newWarranty, 201);
  } catch (err) {
    if (err.message.includes("Invalid date")) {
      return sendBadRequest(res, err.message);
    }
    sendError(res, "Error adding warranty", 500, err);
  }
};

export const deleteWarranty = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const deleted = await deleteSingleWarranty(user, id);
    if (!deleted) {
      return sendNotFound(res, "Warranty not found");
    }
    sendSuccess(res, { message: "Warranty deleted successfully" });
  } catch (err) {
    sendError(res, "Error deleting warranty", 500, err);
  }
};

export const getWarrantyPDF = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    await getWarrantyPDFFile(userId, id, res);
  } catch (err) {
    if (err.message.includes("not found")) {
      return sendNotFound(res, err.message);
    }
    sendError(res, "Error fetching PDF", 500, err);
  }
};
