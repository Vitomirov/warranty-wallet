import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Ensure you import the 'fs' module

// Define __dirname for use in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env variables
dotenv.config({ path: `${__dirname}/../../../.env` });

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send warranty claim email
export async function sendWarrantyClaimEmail(sellersEmail, productName, username, userEmail, pdfFilePath) {
  console.log("Retrieved pdfFilePath from DB:", pdfFilePath);
  const subject = `Customer Warranty Claim – ${productName}`;
  const text = `
  Dear Customer Service Team,

  I am reaching out to request assistance with a warranty claim for a product I recently purchased. Here are the details:

  - **Product Name**: ${productName}
  
  I would appreciate any guidance on how to proceed with this claim. Please feel free to contact me if further information is required.

  Thank you for your attention to this matter.

  Best regards,
  ${username}
`;


  // Log the PDF file path
  console.log('Attempting to send email with PDF file at:', pdfFilePath);

  // Check if the file exists and log its size
  if (!fs.existsSync(pdfFilePath)) {
    console.error('File does not exist:', pdfFilePath);
    throw new Error('File does not exist');
  }

  const stats = fs.statSync(pdfFilePath);
  console.log('File size before sending:', stats.size);
  if (stats.size === 0) {
    console.error('File is empty:', pdfFilePath);
    throw new Error('File is empty');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sellersEmail,
    subject,
    text,
    username,
    replyTo: userEmail,
    attachments: [
      {
        filename: 'warranty.pdf',
        path: pdfFilePath,
      },
    ],
  };

  console.log('Mail Options:', mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully with attachment!');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error);
    throw error;
  }
}