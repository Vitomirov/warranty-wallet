// src/backend/warranty/warranty.service.js

import db from "../config/db.js";
import fs from "fs";
import path from "path";
import {
  formatWarrantyForResponse,
  parseAndFormatDateForDB,
} from "./warranty.helper.js";
import { logActivity } from "../core/logActivity.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Correct path to the central uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

export const getAllWarranties = async (userId) => {
  const sql = "SELECT * FROM warranties WHERE userId = ?";
  const [results] = await db.query(sql, [userId]);
  return results.map(formatWarrantyForResponse);
};

export const getSingleWarranty = async (userId, warrantyId) => {
  const sql = "SELECT * FROM warranties WHERE userId = ? AND warrantyId = ?";
  const [result] = await db.query(sql, [userId, warrantyId]);
  if (result.length === 0) {
    return null;
  }
  return formatWarrantyForResponse(result[0]);
};

export const addNewWarranty = async (data, file, user) => {
  const { productName, dateOfPurchase, warrantyExpireDate, sellersEmail } =
    data;

  if (!file) {
    throw new Error("PDF file is required");
  }

  const dbPurchaseDate = parseAndFormatDateForDB(dateOfPurchase);
  const dbExpireDate = parseAndFormatDateForDB(warrantyExpireDate);

  if (!dbPurchaseDate || !dbExpireDate) {
    fs.unlinkSync(file.path);
    throw new Error("Invalid date format received.");
  }

  const sql =
    "INSERT INTO warranties (productName, dateOfPurchase, warrantyExpireDate, sellersEmail, userId, pdfFilePath) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await db.query(sql, [
    productName,
    dbPurchaseDate,
    dbExpireDate,
    sellersEmail,
    user.userId,
    file.path,
  ]);

  await logActivity(
    user,
    "Created warranty",
    `Product: ${productName}, Expires: ${warrantyExpireDate}`
  );

  return {
    warrantyId: result.insertId,
    message: "Warranty added successfully",
  };
};

export const deleteSingleWarranty = async (user, warrantyId) => {
  const [existingWarranty] = await db.query(
    "SELECT pdfFilePath, productName, warrantyExpireDate FROM warranties WHERE userId = ? AND warrantyId = ?",
    [user.userId, warrantyId]
  );

  if (existingWarranty.length === 0) {
    return false;
  }

  const { pdfFilePath, productName, warrantyExpireDate } = existingWarranty[0];

  if (pdfFilePath && fs.existsSync(pdfFilePath)) {
    fs.unlinkSync(pdfFilePath);
  }

  const sql = "DELETE FROM warranties WHERE userId = ? AND warrantyId = ?";
  const [result] = await db.query(sql, [user.userId, warrantyId]);

  if (result.affectedRows > 0) {
    await logActivity(
      user,
      "Deleted warranty",
      `Product: ${productName}, Expires: ${warrantyExpireDate}`
    );
    return true;
  }
  return false;
};

export const getWarrantyPDFFile = async (userId, warrantyId, res) => {
  const sql =
    "SELECT pdfFilePath FROM warranties WHERE userId = ? AND warrantyId = ?";
  const [result] = await db.query(sql, [userId, warrantyId]);

  if (result.length === 0 || !result[0].pdfFilePath) {
    throw new Error("Warranty or PDF path not found");
  }

  const pdfFilePath = result[0].pdfFilePath;
  if (!fs.existsSync(pdfFilePath)) {
    throw new Error("File not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + path.basename(pdfFilePath) + '"'
  );
  res.sendFile(pdfFilePath);
};
