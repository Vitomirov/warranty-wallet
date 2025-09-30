import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// Create a nodemailer transporter using environment variables
export const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: process.env.MAILGUN_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});
