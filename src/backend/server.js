import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './db.js'; 
import authRoutes from './routes/auth.js';
import warrantiesRoutes from './routes/warranties.js';
import userRoutes from './routes/user.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';
import { sendWarrantyClaimEmail, sendExpirationNotificationEmail } from './routes/email.js';
import cron from 'node-cron';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  credentials: true,
  maxAge: 3600
}));

// Environment variables setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/../../.env` }); // Load .env variables

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload directory setup
const uploadDirectory = path.join(__dirname, 'uploads');
const upload = multer({ dest: uploadDirectory });

app.use('/uploads', express.static(uploadDirectory));
app.use('/warranties', upload.single('pdfFile'), warrantiesRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes); 

// Sending warranty claims emails
app.post('/warranty/claim', async (req, res) => {
  const { userId, productName, username, issueDescription, warrantyId } = req.body;

  try {
    const [warranties] = await db.promise().query('SELECT sellersEmail, pdfFilePath FROM warranties WHERE warrantyId = ?', [warrantyId]);
    if (warranties.length === 0) return res.status(404).send('Warranty not found');
    const { sellersEmail, pdfFilePath } = warranties[0];
    console.log('PDF File Path:', pdfFilePath);

    if (!pdfFilePath) {
      console.error('pdfFilePath is undefined');
      return res.status(400).send('File path is undefined');
    }

    if (!fs.existsSync(pdfFilePath)) {
      console.error('File does not exist:', pdfFilePath);
      return res.status(400).send('File not found');
    }

    const stats = fs.statSync(pdfFilePath);
    console.log('File size before sending:', stats.size);
    if (stats.size === 0) {
      console.error('File is empty:', pdfFilePath);
      return res.status(400).send('File is empty');
    }

    const [users] = await db.promise().query(
      'SELECT userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) return res.status(404).send('User  not found');
    const { userEmail, fullName, userAddress, userPhoneNumber } = users[0];

    // Log the parameters before sending the email
    console.log('Sending email with parameters:', {
      sellersEmail,
      productName,
      username,
      userEmail,
      fullName,
      userAddress,
      userPhoneNumber,
      issueDescription,
      pdfFilePath,
    });

    // Send the email with the attachment
    await sendWarrantyClaimEmail(sellersEmail, productName, username, userEmail, { fullName, userAddress, userPhoneNumber }, issueDescription, pdfFilePath);
    res.status(200).send('Claim submitted successfully!');
  } catch (error) {
    console.error('Error handling warranty claim:', error);
    res.status(500).send('Internal server error');
  }
});

// Function to check for nearly expired warranties
const checkForNearlyExpiredWarranties = async () => {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date(currentDate);
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  try {
    // Query to find warranties expiring in the next 14 days
    const [warranties] = await db.promise().query(
      'SELECT w.warrantyId, w.sellersEmail, u.userEmail, u.fullName, u.userAddress, u.userPhoneNumber, w.productName, w.pdfFilePath ' +
      'FROM warranties w ' +
      'JOIN users u ON w .userId = u.id ' +
      'WHERE w.warrantyExpireDate BETWEEN ? AND ? AND w.notified = 0',
      [currentDate.toISOString().split('T')[0], fourteenDaysFromNow.toISOString().split('T')[0]]
    );

    // Loop through each warranty and send email
    for (const warranty of warranties) {
      const { sellersEmail, userEmail, fullName, userAddress, userPhoneNumber, productName, pdfFilePath } = warranty;

      // Send email notification
      await sendExpirationNotificationEmail(sellersEmail, productName, userEmail, fullName); // Call the new function for expiration notifications

      // Update the database to mark that a notification has been sent
      await db.promise().query(
        'UPDATE warranties SET notified = 1 WHERE warrantyId = ?',
        [warranty.warrantyId]
      );
    }
  } catch (error) {
    console.error('Error checking for nearly expired warranties:', error);
  }
};

// Schedule the cron job to run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Checking for nearly expired warranties...');
  await checkForNearlyExpiredWarranties();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});