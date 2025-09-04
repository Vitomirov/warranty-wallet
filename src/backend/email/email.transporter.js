import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// Log environment variables for debugging (can be removed later)
console.log("Mailgun Host:", process.env.MAILGUN_SMTP_HOST);
console.log("Mailgun User:", process.env.MAILGUN_SMTP_USER);

// Create a nodemailer transporter using environment variables
export const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: process.env.MAILGUN_SMTP_PORT,
  secure: false, // Set 'secure' to true for port 465 (SSL)
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});
