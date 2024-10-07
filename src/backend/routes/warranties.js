import express from 'express';
import connection from '../db.js';
import { format } from 'date-fns';
import { verifyToken } from './auth.functions.js';

const router = express.Router();

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
}

// Route to get all warranties for the logged-in user
router.get('/all', verifyToken, (req, res) => {
  console.log(`Retrieving warranties for user: ${req.user.userId}`);

  const sql = 'SELECT * FROM warranties WHERE userId = ?';
  connection.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error(`Error retrieving warranties for user ${req.user.userId}:`, err);
      return res.status(500).send({ message: 'Error fetching warranties', error: err.message });
    }

    if (results.length === 0) {
      console.log(`No warranties found for user: ${req.user.userId}`);
      return res.status(404).send({ message: 'No warranties found' });
    }

    // Format dates
    const formattedWarranties = results.map(warranty => ({
      ...warranty,
      dateOfPurchase: formatDate(warranty.dateOfPurchase),
      warrantyExpireDate: formatDate(warranty.warrantyExpireDate),
    }));

    res.json(formattedWarranties);
  });
});
// Route to get a specific warranty by ID
router.get('/details/:id', verifyToken, (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'SELECT * FROM warranties WHERE userId = ? AND warrantyId = ?';
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


// Route to add a new warranty
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productName, dateOfPurchase, warrantyExpireDate } = req.body;

    // Insert warranty into the database
    const sql = 'INSERT INTO warranties (warrantyId, productName, dateOfPurchase, warrantyExpireDate, userId) VALUES (NULL, ?, ?, ?, ?)';
    connection.query(sql, [productName, dateOfPurchase, warrantyExpireDate, req.user.userId], (err, result) => {
      if (err) {
        console.error('Error adding warranty:', err);
        return res.status(500).send({ message: 'Error adding warranty', error: err.message });
      }
      res.status(201).send({ message: 'Warranty added successfully' });
    });
  } catch (err) {
    console.error('Error adding warranty:', err);
    return res.status(500).send({ message: 'Error adding warranty', error: err.message });
  }
});

// Route to delete a warranty
router.delete('/delete/:id', verifyToken, (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'DELETE FROM warranties WHERE warrantyId = ? AND userId = ?';
  connection.query(sql, [warrantyId, userId], (err, result) => {
    if (err) {
      console.error('Error deleting warranty:', err);
      return res.status(500).send({ message: 'Error deleting warranty', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Warranty not found' });
    }
    res.send({ message: 'Warranty deleted successfully' });
  });
});

export default router;
