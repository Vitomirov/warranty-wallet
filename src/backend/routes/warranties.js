import express from 'express';
import connection from '../db.js';
import multer from 'multer';
import { verifyToken } from './auth.js';

const router = express.Router();

// Setting up multer for file upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to get all warranties for the logged-in user
router.get('/all', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM warranties WHERE userId = ?';
  connection.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error('Error fetching warranties:', err);
      return res.status(500).send('Error fetching warranties');
    }
    if (results.length === 0) {
      return res.status(404).send('No warranties found');
    }
    res.json(results);
  });
});

// Route to get a specific warranty by ID
router.get('/:id', verifyToken, (req, res) => {
  const warrantyId = req.params.id;

  const sql = 'SELECT * FROM warranties WHERE id = ? AND userId = ?';
  connection.query(sql, [warrantyId, req.user.userId], (err, result) => {
    if (err) {
      console.error('Error fetching warranty:', err);
      return res.status(500).send('Error fetching warranty');
    }
    if (result.length === 0) {
      return res.status(404).send('Warranty not found');
    }
    res.json(result[0]);
  });
});

// Route to add a new warranty
router.post('/', verifyToken, upload.single('warrantyImage'), (req, res) => {
  const { productName, dateOfPurchase, warrantyExpireDate } = req.body;
  const warrantyImage = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO warranties (productName, dateOfPurchase, warrantyExpireDate, warrantyImage, userId) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [productName, dateOfPurchase, warrantyExpireDate, warrantyImage, req.user.userId], (err, result) => {
    if (err) {
      console.error('Error adding warranty:', err);
      return res.status(500).send('Error adding warranty');
    }
    res.status(201).send('Warranty added');
  });
});

export default router;
