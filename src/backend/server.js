import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './db.js'; // Make sure this is your database connection file
import authRoutes from './routes/auth.js';
import warrantiesRoutes from './routes/warranties.js';
import userRoutes from './routes/user.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';
import { sendWarrantyClaimEmail } from './routes/email.js';
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

// Sending complaints mails
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});