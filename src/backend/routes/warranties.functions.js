import db from "../db.js";
import { format, parse } from "date-fns";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "./utils/httpResponses.js";
import { logActivity } from "./utils/logActivity.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return format(d, "dd-MM-yyyy");
};

// Function to parse "dd-MM-yyyy" and format for DB "yyyy-MM-dd"
const parseAndFormatDateForDB = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
  if (isNaN(parsedDate.getTime())) {
    console.error(`Failed to parse date string: ${dateString}`); // Keep specific logging
    return null;
  }
  return format(parsedDate, "yyyy-MM-dd");
};

// Function to format a single warranty object for frontend response
const formatWarrantyForResponse = (warranty) => {
  if (!warranty) return null;
  const formatted = {
    ...warranty,
    dateOfPurchase: formatDate(warranty.dateOfPurchase),
    warrantyExpireDate: formatDate(warranty.warrantyExpireDate),
  };
  const BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:3000";
  // Convert PDF path to URL if it exists
  if (formatted.pdfFilePath) {
    formatted.pdfFilePath = `${BASE_URL}/${formatted.pdfFilePath.replace(
      /^\/+/,
      ""
    )}`;
  } else {
    delete formatted.pdfFilePath;
  }
  return formatted;
};

// --- Warranty Functions (now use imported helpers) ---

// Get and display specific warranty by ID for the logged-in user
export const getWarranty = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;
  const sql = "SELECT * FROM warranties WHERE userId = ? AND warrantyId = ?";

  try {
    const [result] = await db.query(sql, [userId, warrantyId]);

    if (result.length === 0) {
      return sendNotFound(res, "Warranty not found");
    }

    const warranty = result[0];
    const formattedWarranty = formatWarrantyForResponse(warranty);

    sendSuccess(res, formattedWarranty);
  } catch (err) {
    sendError(res, "Error fetching warranty", 500, err);
  }
};

// Get all warranties for the logged-in user
export const getWarranties = async (req, res) => {
  const sql = "SELECT * FROM warranties WHERE userId = ?";
  try {
    const [results] = await db.query(sql, [req.user.userId]);

    if (results.length === 0) {
      return sendSuccess(res, []); // Return empty array for no results using helper
    } // Format each warranty object using the helper function

    const formattedWarranties = results.map(formatWarrantyForResponse);

    sendSuccess(res, formattedWarranties);
  } catch (err) {
    sendError(res, "Error fetching warranties", 500, err);
  }
};

// Get the PDF file for a specific warranty by ID
export const getWarrantyPDF = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql =
    "SELECT pdfFilePath FROM warranties WHERE userId = ? AND warrantyId = ?";
  try {
    const [result] = await db.query(sql, [userId, warrantyId]);

    if (result.length === 0 || !result[0].pdfFilePath) {
      return sendNotFound(res, "Warranty or PDF path not found");
    }

    const pdfFilePath = result[0].pdfFilePath;

    if (!fs.existsSync(pdfFilePath)) {
      console.error("File does not exist:", pdfFilePath); // Keep specific file logging
      return sendNotFound(res, "File not found");
    } // Set headers to display PDF in the browser and send the file

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + path.basename(pdfFilePath) + '"'
    );

    res.sendFile(pdfFilePath, (err) => {
      if (err) {
        console.error("Error sending PDF file:", err);

        res.status(err.status || 500).end();
      }
    });
  } catch (err) {
    sendError(res, "Error fetching warranty PDF path", 500, err);
  }
};

// Add a new warranty with file upload
export const addWarranty = async (req, res) => {
  try {
    const { productName, dateOfPurchase, warrantyExpireDate, sellersEmail } =
      req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return sendBadRequest(res, "PDF file is required");
    }

    // Parse and format dates for database insertion
    const dbPurchaseDate = parseAndFormatDateForDB(dateOfPurchase);
    const dbExpireDate = parseAndFormatDateForDB(warrantyExpireDate);

    if (dbPurchaseDate === null || dbExpireDate === null) {
      return sendBadRequest(res, "Invalid date format received.");
    }

    const pdfFilePathForDB = pdfFile.path; // Insert warranty data into the database

    const sql =
      "INSERT INTO warranties (productName, dateOfPurchase, warrantyExpireDate, sellersEmail, userId, pdfFilePath) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(sql, [
      productName,
      dbPurchaseDate,
      dbExpireDate,
      sellersEmail,
      req.user.userId,
      pdfFilePathForDB,
    ]);

    // INSERT log entry
    await logActivity(
      req.user,
      "Created warranty",
      `Product: ${productName}, Expires: ${warrantyExpireDate}`
    );

    sendSuccess(res, { message: "Warranty added successfully" }, 201);
  } catch (error) {
    sendError(res, "Error adding warranty", 500, error);
  }
};

// Delete a specific warranty by ID for the logged-in user
export const deleteWarranty = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  // First, fetch warranty details before deleting it
  const [existingWarranty] = await db.query(
    "SELECT productName, warrantyExpireDate, pdfFilePath FROM warranties WHERE userId = ? AND warrantyId = ?",
    [userId, warrantyId]
  );

  if (existingWarranty.length === 0) {
    return sendNotFound(res, "Warranty not found");
  }

  const { productName, warrantyExpireDate, pdfFilePath } = existingWarranty[0]; // Extract relevant data

  // Delete PDF file from disk
  if (pdfFilePath && fs.existsSync(pdfFilePath)) {
    try {
      fs.unlinkSync(pdfFilePath);
      console.log("PDF file deleted:", pdfFilePath);
    } catch (fileErr) {
      console.error("Failed to delete PDF file:", fileErr);
    }
  }

  // SQL query for deleting the warranty
  const sql = "DELETE FROM warranties WHERE userId = ? AND warrantyId = ?";
  try {
    const result = await db.query(sql, [userId, warrantyId]);

    if (result.affectedRows === 0) {
      return sendNotFound(res, "Warranty not found");
    }

    // Send success response after deletion
    sendSuccess(res, { message: "Warranty deleted successfully" });

    // Log the activity after deletion
    await logActivity(
      req.user,
      "Deleted warranty",
      `Product: ${productName}, Expires: ${warrantyExpireDate}`
    );
  } catch (err) {
    sendError(res, "Error deleting warranty", 500, err);
  }
};
