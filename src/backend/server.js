import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";
import cron from "node-cron";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import warrantiesRoutes from "./routes/warranties.js";
import userRoutes from "./routes/user.js";
import {
  sendWarrantyClaimEmail,
  sendExpirationNotificationEmail,
} from "./routes/email.js";
import db from "./db.js";

// Load environment variables
dotenv.config({ path: ".env.production" });
console.log("Process.env log from server.js:", process.env);

// Initialize Express app
const app = express();

// Constants
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname (server.js):", __dirname); // Dodato logovanje
const uploadDirectory = path.join(__dirname, "uploads");
const upload = multer({ dest: uploadDirectory });

// Ensure 'uploads' directory exists
console.log("uploadDirectory (server.js):", uploadDirectory); // Dodato logovanje

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log("'uploads' folder created successfully.");
} else {
  console.log("'uploads' folder already exists.");
}

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization", "Set-Cookie"],
    credentials: true,
    maxAge: 3600,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDirectory));

// Test Database Connection Route
app.get("/api/testdb", async (req, res) => {
  try {
    const [results] = await db.query("SELECT 1");
    res.send(`Database connection successful: ${JSON.stringify(results)}`);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Database query error");
  }
});

app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

// Routes
app.use("/api/warranties", upload.single("pdfFile"), warrantiesRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Email Sending Route
app.post("/api/warranty/claim", async (req, res) => {
  const { userId, productName, username, issueDescription, warrantyId } =
    req.body;

  console.log("Received request to /warranty/claim:", req.body); // Log the request body

  try {
    const [warranties] = await db.query(
      "SELECT sellersEmail, pdfFilePath FROM warranties WHERE warrantyId = ?",
      [warrantyId]
    );
    if (warranties.length === 0) {
      console.error(`Warranty not found for ID: ${warrantyId}`);
      return res.status(404).send("Warranty not found");
    }
    const { sellersEmail, pdfFilePath } = warranties[0];

    if (!pdfFilePath) {
      console.error("pdfFilePath is undefined");
      return res.status(400).send("File path is undefined");
    }
    console.log("Checking file existence at:", pdfFilePath);
    if (!fs.existsSync(pdfFilePath)) {
      console.error("File does not exist:", pdfFilePath);
      return res.status(400).send("File not found");
    }

    const stats = fs.statSync(pdfFilePath);
    if (stats.size === 0) {
      console.error("File is empty:", pdfFilePath);
      return res.status(400).send("File is empty");
    }

    const [users] = await db.query(
      "SELECT userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      console.error(`User  not found for ID: ${userId}`);
      return res.status(404).send("User  not found");
    }
    const { userEmail, fullName, userAddress, userPhoneNumber } = users[0];

    await sendWarrantyClaimEmail(
      sellersEmail,
      productName,
      username,
      userEmail,
      { fullName, userAddress, userPhoneNumber },
      issueDescription,
      pdfFilePath
    );
    res.status(200).send("Claim submitted successfully!");
  } catch (error) {
    console.error("Error handling warranty claim:", error); // Log the error
    res.status(500).send("Internal server error: " + error.message);
  }
});

// Cron Job for Nearly Expired Warranties
const checkForNearlyExpiredWarranties = async () => {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date(currentDate);
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  try {
    const [warranties] = await db
      .promise()
      .query(
        "SELECT w.warrantyId, w.sellersEmail, u.userEmail, u.fullName, u.userAddress, u.userPhoneNumber, w.productName, w.pdfFilePath " +
          "FROM warranties w " +
          "JOIN users u ON w.userId = u.id " +
          "WHERE w.warrantyExpireDate BETWEEN ? AND ? AND w.notified = 0",
        [
          currentDate.toISOString().split("T")[0],
          fourteenDaysFromNow.toISOString().split("T")[0],
        ]
      );

    for (const warranty of warranties) {
      try {
        const { sellersEmail, userEmail, fullName, productName } = warranty;
        await sendExpirationNotificationEmail(
          sellersEmail,
          productName,
          userEmail,
          fullName
        );
        await db
          .promise()
          .query("UPDATE warranties SET notified = 1 WHERE warrantyId = ?", [
            warranty.warrantyId,
          ]);
      } catch (emailError) {
        console.error(
          `Error sending expiration email for warranty ${warranty.warrantyId}:`,
          emailError
        );
      }
    }
  } catch (error) {
    console.error("Error checking for nearly expired warranties:", error);
  }
};

cron.schedule("0 9 * * *", async () => {
  console.log("Checking for nearly expired warranties...");
  await checkForNearlyExpiredWarranties();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
