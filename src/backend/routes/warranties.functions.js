import db from '../db.js';
import { format } from 'date-fns';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

// Function to get all warranties for the logged-in user
export const getWarranties = async (req, res) => {
  console.log(`Retrieving warranties for user: ${req.user.userId}`);

  const sql = 'SELECT * FROM warranties WHERE userId = ?';
  try {
    const [results] = await db.query(sql, [req.user.userId]); // Use await for the query
    if (results.length === 0) {
      console.log(`No warranties found for user: ${req.user.userId}`);
      return res.json([]);
    }

    console.log(`Warranties found for user ${req.user.userId}:`, results);

    // Format dates
    const formattedWarranties = results.map(warranty => ({
      ...warranty,
      dateOfPurchase: formatDate(warranty.dateOfPurchase),
      warrantyExpireDate: formatDate(warranty.warrantyExpireDate),
    }));

    res.json(formattedWarranties);
  } catch (err) {
    console.error(`Error retrieving warranties for user ${req.user.userId}:`, err);
    return res.status(500).send({ message: 'Error fetching warranties', error: err.message });
  }
};

// Function to get and display specific warranty by ID
export const getWarranty = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'SELECT * FROM warranties WHERE userId = ? AND warrantyId = ?';
  try {
    const [result] = await db.query(sql, [userId, warrantyId]); // Use await for the query
    if (result.length === 0) {
      return res.status(404).send('Warranty not found');
    }
    const warranty = result[0];

    // Format dates
    warranty.dateOfPurchase = formatDate(warranty.dateOfPurchase);
    warranty.warrantyExpireDate = formatDate(warranty.warrantyExpireDate);

    // Convert to URL path
    warranty.pdfFilePath = `http://localhost:3000/${warranty.pdfFilePath.replace(/^\/+/, '')}`;

    res.json(warranty);
  } catch (err) {
    console.error('Error fetching warranty:', err);
    return res.status(500).send('Error fetching warranty');
  }
};

// Function to get the PDF file path for a specific warranty
export const getWarrantyPDF = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'SELECT pdfFilePath FROM warranties WHERE userId = ? AND warrantyId = ?';
  try {
    const [result] = await db.query(sql, [userId, warrantyId]); // Use await for the query
    if (result.length === 0) {
      return res.status(404).send('Warranty not found');
    }

    const pdfFilePath = result[0].pdfFilePath;
    console.log('PDF file path:', pdfFilePath); 

    if (!fs.existsSync(pdfFilePath)) {
      console.error('File does not exist:', pdfFilePath);
      return res.status(404).send('File not found');
    }

    // Set headers to display PDF in the browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(pdfFilePath) + '"');
    
    // Check if the file exists before sending
    res.sendFile(pdfFilePath, (err) => {
      if (err) {
        console.error('Error sending PDF file:', err);
        res.status(err.status).end();
      } else {
        console.log('PDF file sent successfully');
      }
    });
  } catch (err) {
    console.error('Error fetching warranty PDF path:', err);
    return res.status(500).send('Error fetching warranty PDF path');
  }
};

// Function to add a new warranty
export const addWarranty = async (req, res) => {
  console.log("Data:", req.body);  
  console.log("File:", req.file);   
  try {
    const { productName, dateOfPurchase, warrantyExpireDate, sellersEmail } = req.body;
    const pdfFile = req.file; // Get the uploaded PDF file

    if (!pdfFile) {
      return res.status(400).send({ message: 'PDF file is required' });
    }

    // Use relative path for the PDF file
    const pdfFilePath = `uploads/${pdfFile.filename}`;

    // Insert warranty into the database
    const sql = 'INSERT INTO warranties (productName, dateOfPurchase, warrantyExpireDate, sellersEmail, userId, pdfFilePath) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(sql, [productName, dateOfPurchase, warrantyExpireDate, sellersEmail, req.user.userId, pdfFile.path]); // Use await for the query

    res.json({ message: 'Warranty added successfully' });
  } catch (error) {
    console.error('Error adding warranty:', error);
    res.status(500).send({ message: 'Error adding warranty' });
  }
};

// Function to delete a warranty
export const deleteWarranty = async (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'DELETE FROM warranties WHERE userId = ? AND warrantyId = ?';
  try {
    const result = await db.query(sql, [userId, warrantyId]); // Use await for the query
    if (result.affectedRows === 0) {
      return res.status(404).send('Warranty not found');
    }
    res.json({ message: 'Warranty deleted successfully' });
  } catch (err) {
    console.error('Error deleting warranty:', err);
    return res.status(500).send('Error deleting warranty');
  }
};