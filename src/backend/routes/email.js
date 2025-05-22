import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables from the .env file
// Ensure the path is correct on the VPS inside the container
// If the file is just .env in the same directory, dotenv.config() without arguments is sufficient
dotenv.config({ path: ".env" });

// Log environment variables for debugging (can be removed later)
console.log("Process.env log from email.js:", process.env);
console.log("Mailgun SMTP Host:", process.env.MAILGUN_SMTP_HOST);
console.log("Mailgun SMTP Port:", process.env.MAILGUN_SMTP_PORT);
console.log("Mailgun SMTP User:", process.env.MAILGUN_SMTP_USER);
console.log("Mailgun SMTP Pass:", process.env.MAILGUN_SMTP_PASSWORD);
console.log("Mail From Address:", process.env.MAIL_FROM_ADDRESS);


// Create a nodemailer transporter
// Now uses Mailgun SMTP data from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: process.env.MAILGUN_SMTP_PORT,
  // Set 'secure' to true if using port 465 (SSL), otherwise false (STARTTLS)
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});

// Function to send warranty claim email
export async function sendWarrantyClaimEmail(
  sellersEmail,
  productName,
  username,
  userEmail,
  userData,
  issueDescription,
  pdfFilePath
) {
  const { fullName, userAddress, userPhoneNumber } = userData; // Destructure user data

  const subject = `Customer Warranty Claim – ${productName}`;
  const text = `
Hi there,

I hope this message finds you well!

My name is ${fullName}, and I recently purchased a ${productName} from you. Unfortunately, I've encountered an issue with it:
- ${issueDescription}

I would really appreciate your assistance in resolving this issue.

Could you please arrange to pick up the product from my address:
${userAddress}?

I’ve attached the warranty for your reference. If you need to discuss anything further, feel free to reach out to me at
${userPhoneNumber}.

Thank you so much for your help! I look forward to hearing from you soon.

Best regards,
${username}
`;

  // Validate the PDF file path
  if (!pdfFilePath || typeof pdfFilePath !== "string") {
    console.error("Invalid PDF file path:", pdfFilePath);
    throw new Error("Invalid PDF file path");
  }

  // Check if the PDF file exists
  if (!fs.existsSync(pdfFilePath)) {
    console.error("File does not exist:", pdfFilePath);
    throw new Error("File does not exist");
  }

  // Check if the file is empty
  const stats = fs.statSync(pdfFilePath);
  if (stats.size === 0) {
    console.error("File is empty:", pdfFilePath);
    throw new Error("File is empty");
  }

  const mailOptions = {
    from: userEmail, // Use variable for 'From' address
    to: sellersEmail,
    subject,
    text,
    replyTo: userEmail, // Reply-To address remains user's email
    attachments: [
      {
        filename: "warranty.pdf",
        path: pdfFilePath,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully with attachment:", info.messageId);
    // You can log other details from the 'info' object if you need them
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message // Log the error message
    );
    throw error; // Rethrow the error for further handling
  }
}

// Function to send expiration notification email
export async function sendExpirationNotificationEmail(
  sellersEmail, // Check application logic, this should probably be userEmail
  productName,
  userEmail, // If sending to the user, this should be the 'to' address.
  fullName
) {
  const subject = `Warranty Expiration Notification – ${productName}`;
  const text = `
Hi there,

This is a reminder that your warranty for ${productName} is about to expire in 14 days.

Please take the necessary actions.

Best regards,
Warranty Wallet Team
`;

  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS, // Use variable for 'From' address
    to: userEmail, // Assuming you are sending to the user, so 'to' is userEmail
    subject,
    text,
    replyTo: process.env.MAIL_FROM_ADDRESS, // Reply-To can be your 'From' address
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Expiration notification email sent successfully:", info.messageId);
    // You can log other details from the 'info' object if you need them
  } catch (error) {
    console.error(
      "Error sending expiration notification email:",
      error.response ? error.response.data : error.message // Log the error message
    );
    throw error; // Rethrow the error for further handling
  }
}

