import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import warrantiesRoutes from './routes/warranties.js';
import userRoutes from './routes/user.js';
import { sendWarrantyClaimEmail, sendExpirationNotificationEmail } from './routes/email.js';

// Load environment variables
dotenv.config();
console.log("Process.env log from server.js:",process.env)

// Initialize Express app
const app = express();

// Constants
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads');
const upload = multer({ dest: uploadDirectory });


// Ensure 'uploads' directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log("'uploads' folder created successfully.");
} else {
  console.log("'uploads' folder already exists.");
}

// Database connection function
const connectToDatabase = async () => {
  const maxAttempts = 20;
  const delay = 10000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log('MySQL pool created successfully.');
      return pool; // Return the pool directly
    } catch (error) {
      attempts++;
      console.error(`Error getting connection from pool (attempt ${attempts}):`, error.message);
      if (attempts < maxAttempts) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('Could not connect to MySQL after several attempts. Exiting...');
        process.exit(1); // Exit the process if unable to connect
      }
    }
  }
};

// Initialize the database connection
const db = await connectToDatabase();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  credentials: true,
  maxAge: 3600
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDirectory));

// Test Database Connection Route
app.get('/testdb', async (req, res) => {
  try {
    const [results] = await db.query('SELECT 1');
    res.send(`Database connection successful: ${JSON.stringify(results)}`);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Database query error");
  }
});

app.get('/test', (req, res) => {
  res.send('Backend is working!');
});

// Routes
app.use('/warranties', upload.single('pdfFile'), warrantiesRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

// Email Sending Route
app.post('/warranty/claim', async (req, res) => {
  const { userId, productName, username, issueDescription, warrantyId } = req.body;

  console.log('Received request to /warranty/claim:', req.body); // Log the request body

  try {
    const [warranties] = await db.query('SELECT sellersEmail, pdfFilePath FROM warranties WHERE warrantyId = ?', [warrantyId]);
    if (warranties.length === 0) {
      console.error(`Warranty not found for ID: ${warrantyId}`);
      return res.status(404).send('Warranty not found');
    }
    const { sellersEmail, pdfFilePath } = warranties[0];

    if (!pdfFilePath) {
      console.error('pdfFilePath is undefined');
      return res.status(400).send('File path is undefined');
    }
    console.log('Checking file existence at:', pdfFilePath);
    if (!fs.existsSync(pdfFilePath)) {
      console.error('File does not exist:', pdfFilePath);
      return res.status(400).send('File not found');
    }

    const stats = fs.statSync(pdfFilePath);
    if (stats.size === 0) {
      console.error('File is empty:', pdfFilePath);
      return res.status(400).send('File is empty');
    }

    const [users] = await db.query('SELECT userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      console.error(`User  not found for ID: ${userId}`);
      return res.status(404).send('User  not found');
    }
    const { userEmail, fullName, userAddress, userPhoneNumber } = users[0];

    await sendWarrantyClaimEmail(sellersEmail, productName, username, userEmail, { fullName, userAddress, userPhoneNumber }, issueDescription, pdfFilePath);
    res.status(200).send('Claim submitted successfully!');
  } catch (error) {
    console.error('Error handling warranty claim:', error); // Log the error
    res.status(500).send('Internal server error: ' + error.message);
  }
});

// Cron Job for Nearly Expired Warranties
const checkForNearlyExpiredWarranties = async () => {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date(currentDate);
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  try {
    const [warranties] = await db.promise().query(
      'SELECT w.warrantyId, w.sellersEmail, u.userEmail, u.fullName, u.userAddress, u.userPhoneNumber, w.productName, w.pdfFilePath ' +
      'FROM warranties w ' +
      'JOIN users u ON w.userId = u.id ' +
      'WHERE w.warrantyExpireDate BETWEEN ? AND ? AND w.notified = 0',
      [currentDate.toISOString().split('T')[0], fourteenDaysFromNow.toISOString().split('T')[0]]
    );

    for (const warranty of warranties) {
      try {
        const { sellersEmail, userEmail, fullName, productName } = warranty;
        await sendExpirationNotificationEmail(sellersEmail, productName, userEmail, fullName);
        await db.promise().query('UPDATE warranties SET notified = 1 WHERE warrantyId = ?', [warranty.warrantyId]);
      } catch (emailError) {
        console.error(`Error sending expiration email for warranty ${warranty.warrantyId}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error checking for nearly expired warranties:', error);
  }
};

cron.schedule('0 9 * * *', async () => {
  console.log('Checking for nearly expired warranties...');
  await checkForNearlyExpiredWarranties();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught an error:", err);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});