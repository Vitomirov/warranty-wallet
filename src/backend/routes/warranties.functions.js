import db from '../db.js';
import { format, parse } from 'date-fns';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; 
    return format(d, 'dd-MM-yyyy');
};

const parseAndFormatDateForDB = (dateString) => {
    if (!dateString) return null;

    const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());


    if (isNaN(parsedDate.getTime())) {
        console.error(`Failed to parse date string: ${dateString}`);
        return null;
    }
    return format(parsedDate, 'yyyy-MM-dd');
};

// Function to get and display specific warranty by ID
export const getWarranty = async (req, res) => {
    console.log('getWarranty called for warrantyId:', req.params.id, 'userId:', req.user.userId);
    const warrantyId = req.params.id;
    const userId = req.user.userId;
    console.log(`Getting warranty details for warrantyId: ${warrantyId}, userId: ${userId}`);
    const sql = 'SELECT * FROM warranties WHERE userId = ? AND warrantyId = ?';
    console.log(`SQL Query: ${sql}, Parameters: [${userId}, ${warrantyId}]`);

    try {
        const [result] = await db.query(sql, [userId, warrantyId]);
        console.log("Database Query Result:", result);
        if (result.length === 0) {
            console.log(`Warranty not found for warrantyId: ${warrantyId}, userId: ${userId}`);
            return res.status(404).json('Warranty not found');
        }

        const warranty = result[0];
        console.log("Warranty details from database:", result[0]);
        // Format dates
        warranty.dateOfPurchase = formatDate(warranty.dateOfPurchase);
        warranty.warrantyExpireDate = formatDate(warranty.warrantyExpireDate);
        // Convert to URL path
        warranty.pdfFilePath = `http://localhost:3000/${warranty.pdfFilePath.replace(/^\/+/, '')}`;
        console.log("Warranty details:", warranty);
        console.log("Warranty details sent to frontend:", warranty);
        res.json(warranty);
    } catch (err) {
        console.error('Error fetching warranty:', err);
        return res.status(500).json('Error fetching warranty');
    }
};

// Function to get all warranties for the logged-in user
export const getWarranties = async (req, res) => { // Dodat export
  console.log(`Retrieving warranties for user: ${req.user.userId}`);

  const sql = 'SELECT * FROM warranties WHERE userId = ?';
  try {
      const [results] = await db.query(sql, [req.user.userId]);
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

// Function to get the PDF file path for a specific warranty
export const getWarrantyPDF = async (req, res) => { // Dodat export
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
        
        const dbPurchaseDate = parseAndFormatDateForDB(dateOfPurchase);
        const dbExpireDate = parseAndFormatDateForDB(warrantyExpireDate);
       
        if (dbPurchaseDate === null || dbExpireDate === null) {
             return res.status(400).send({ message: 'Invalid date format received.' });
        }

        const pdfFilePathForDB = pdfFile.path;


        // Insert warranty into the database
        const sql = 'INSERT INTO warranties (productName, dateOfPurchase, warrantyExpireDate, sellersEmail, userId, pdfFilePath) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(sql, [productName, dbPurchaseDate, dbExpireDate, sellersEmail, req.user.userId, pdfFilePathForDB]);

        res.json({ message: 'Warranty added successfully' });
    } catch (error) {
        console.error('Error adding warranty:', error);
        res.status(500).send({ message: 'Error adding warranty', error: error.message });
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