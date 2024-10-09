import express from 'express';
import connection from '../db.js';
import { verifyToken } from './auth.functions.js';
import { getWarranties, getWarranty, addWarranty, deleteWarranty } from './warranties.functions.js';

const router = express.Router();

// Route to get all warranties for the logged-in user
router.get('/all', verifyToken, getWarranties);

// Route to get a specific warranty by ID
router.get('/details/:id', verifyToken, getWarranty);

// Route to add a new warranty
router.post('/', verifyToken, addWarranty);

// Route to delete a warranty
router.delete('/delete/:id', verifyToken, deleteWarranty);

export default router;