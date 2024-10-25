import express from 'express';
import { verifyToken } from './auth.functions.js';
import { getWarranties, getWarranty, addWarranty, deleteWarranty, getWarrantyPDF } from './warranties.functions.js'; // Import getWarrantyPDF
import multer from 'multer';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads'); // Custom upload directory
const upload = multer({ dest: uploadDirectory });

const router = express.Router();

// Route to get all warranties for the logged-in user
router.get('/all', verifyToken, getWarranties);

// Route to get a specific warranty by ID
router.get('/details/:id', verifyToken, getWarranty);

// Route to add a new warranty
router.post('/', verifyToken, addWarranty);

// Route to get the PDF of a specific warranty
router.get('/pdf/:id', verifyToken, getWarrantyPDF); // Ensure this route is included

// Route to delete a warranty
router.delete('/delete/:id', verifyToken, deleteWarranty);

export default router;