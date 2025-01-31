import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; 

// Define __dirname for use in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env variables
dotenv.config({ path: `${__dirname}/../../../.env` });

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send warranty claim email
export async function sendWarrantyClaimEmail(sellersEmail, productName, username, userEmail, userData, issueDescription, pdfFilePath) {
  const { fullName, userAddress, userPhoneNumber } = userData; // Destructure user data

  const subject = `Customer Warranty Claim – ${productName}`;
  const text = `
  Hi there,

  I'm ${fullName}, and I recently purchased a ${productName}. 
  I'm reaching out because I’m experiencing an issue: ${issueDescription}.

  Could you please arrange to pick it up from my address: ${userAddress}? 
  If you have any questions, feel free to call me at ${userPhoneNumber}.

  Thanks so much for your help!

  Best,
  ${username}
`;

  // Validate the PDF file path
  if (!pdfFilePath || typeof pdfFilePath !== 'string') {
    console.error('Invalid PDF file path:', pdfFilePath);
    throw new Error('Invalid PDF file path');
  }

  // Check if the PDF file exists
  if (!fs.existsSync(pdfFilePath)) {
    console.error('File does not exist:', pdfFilePath);
    throw new Error('File does not exist');
  }

  // Check if the file is empty
  const stats = fs.statSync(pdfFilePath);
  if (stats.size === 0) {
    console.error('File is empty:', pdfFilePath);
    throw new Error('File is empty');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sellersEmail,
    subject,
    text,
    replyTo: userEmail,
    attachments: [
      {
        filename: 'warranty.pdf',
        path: pdfFilePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully with attachment!');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error);
    throw error; // Rethrow the error for further handling
  }
}

// Function to send expiration notification email
export async function sendExpirationNotificationEmail(sellersEmail, productName, userEmail, fullName) {
  const subject = `Warranty Expiration Notification – ${productName}`;
  const text = `
  Hi there,

  This is a reminder that your warranty for ${productName} is about to expire in 14 days.

  Please take the necessary actions.

  Best regards,
  Warranty Wallet Team
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sellersEmail,
    subject,
    text,
    replyTo: userEmail,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Expiration notification email sent successfully!');
  } catch (error) {
    console.error('Error sending expiration notification email:', error.response ? error.response.data : error);
    throw error; // Rethrow the error for further handling
  }
}