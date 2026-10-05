import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(__dirname, "../../../" + envFile) });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const smtpPort = Number(process.env.MAILGUN_SMTP_PORT) || 587;

export const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort !== 465,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});
