import connection from '../db.js';
import { format } from 'date-fns';

// Function to format date to "dd-MM-yyyy"
const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

// Function to get all warranties for the logged-in user
export const getWarranties = (req, res) => {
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
};

// Function to get a specific warranty by ID
export const getWarranty = (req, res) => {
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
};

// Function to add a new warranty
export const addWarranty = async (req, res) => {
  console.log("Data:", req.body);  
  console.log("File:", req.file);   
  try {
    const { productName, dateOfPurchase, warrantyExpireDate } = req.body;
    const pdfFile = req.file; // Get the uploaded PDF file

    if (!pdfFile) {
      return res.status(400).send({ message: 'PDF file is required' });
    }

    // Insert warranty into the database
    const sql = 'INSERT INTO warranties (warrantyId, productName, dateOfPurchase, warrantyExpireDate, userId, pdfFilePath) VALUES (NULL, ?, ?, ?, ?, ?)';
    connection.query(sql, [productName, dateOfPurchase, warrantyExpireDate, req.user.userId , pdfFile.path], (err, results) => {
      if (err) {
        console.error('Error adding warranty:', err);
        return res.status(500).send({ message: 'Error adding warranty' });
      }

      res.json({ message: 'Warranty added successfully' });
    });
  } catch (error) {
    console.error('Error adding warranty:', error);
    res.status(500).send({ message: 'Error adding warranty' });
  }
};

// Function to delete a warranty
export const deleteWarranty = (req, res) => {
  const warrantyId = req.params.id;
  const userId = req.user.userId;

  const sql = 'DELETE FROM warranties WHERE userId = ? AND warrantyId = ?';
  connection.query(sql, [userId, warrantyId], (err, result) => {
    if (err) {
      console.error('Error deleting warranty:', err);
      return res.status(500).send('Error deleting warranty');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Warranty not found');
    }
    res.json({ message: 'Warranty deleted successfully' });
  });
};