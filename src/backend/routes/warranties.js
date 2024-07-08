import express from 'express';
import connection from '../db.js';

const router = express.Router();

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

router.get('/', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM warranties WHERE userId = ?';
  connection.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error('Error fetching warranties:', err);
      return res.status(500).send('Error fetching warranties');
    }
    res.json(results);
  });
});

router.post('/', verifyToken, (req, res) => {
  const { title, description, purchaseDate, expirationDate } = req.body;
  const sql = 'INSERT INTO warranties (title, description, purchaseDate, expirationDate, userId) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [title, description, purchaseDate, expirationDate, req.user.userId], (err, result) => {
    if (err) {
      console.error('Error adding warranty:', err);
      return res.status(500).send('Error adding warranty');
    }
    res.status(201).send('Warranty added');
  });
});

export default router;
