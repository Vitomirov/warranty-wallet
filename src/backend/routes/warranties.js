import express from 'express';
import connection from '../db.js';
import multer from 'multer';
import { verifyToken } from './auth.js';
import fs from 'fs';
import path from 'path';
import { extname } from 'path';
import { format } from 'date-fns';
import { fileURLToPath } from 'url';

// Obtain the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
}

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

    // Format dates
    results = results.map(warranty => ({
      ...warranty,
      dateOfPurchase: formatDate(warranty.dateOfPurchase),
      warrantyExpireDate: formatDate(warranty.warrantyExpireDate),
    }));

    res.json(results);
  });
});

// Route to get a specific warranty by ID
router.get('/:id', verifyToken, (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'SELECT * FROM warranties WHERE userId = ? AND id = ?';
  connection.query(sql, [userId, warrantyId], (err, result) => {
    if (err) {
      console.error('Error fetching warranty:', err);
      return res.status(500).send('Error fetching warranty');
    }
    if (result.length === 0) {
      return res.status(404).send('Warranty not found');
    }
    
    const warranty = result[0];

    // Format dates
    warranty.dateOfPurchase = formatDate(warranty.dateOfPurchase);
    warranty.warrantyExpireDate = formatDate(warranty.warrantyExpireDate);

    // If warrantyImage is not provided, return the warranty data without image
    res.json(warranty);
  });
});

// Route to get a specific warranty image by filename
router.get('/warranty-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  // Check if file exists and is a valid image type
  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.error('Image file not found:', err);
      return res.status(404).send('Image file not found');
    }

    const validExtensions = ['.jpg', '.jpeg', '.png'];
    if (validExtensions.includes(extname(filename).toLowerCase())) {
      res.sendFile(filepath);
    } else {
      console.error('Invalid file type:', extname(filename));
      res.status(400).send('Invalid file type');
    }
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
