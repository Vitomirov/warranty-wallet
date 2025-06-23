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
import aiRoutes from "./routes/ai.js";
import {
  sendWarrantyClaimEmail,
  sendExpirationNotificationEmail,
} from "./routes/email.js";
import db from "./db.js";

// Load environment variables
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

console.log("Process.env log from server.js:", process.env);
console.log("Backend test endpoint called successfully! (Production");
// Initialize Express app
const app = express();

// Constants
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname (server.js):", __dirname);
const uploadDirectory = path.join(__dirname, "uploads");
const upload = multer({ dest: uploadDirectory });

// Ensure 'uploads' directory exists
console.log("uploadDirectory (server.js):", uploadDirectory);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log("'uploads' folder created successfully.");
} else {
  console.log("'uploads' folder already exists.");
}

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://devitowarranty.xyz", "https://www.devitowarranty.xyz"]
    : ["http://localhost:5173"];
// Middleware
app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/api/ai", aiRoutes);

// Email Sending Route
app.post("/api/warranty/claim", async (req, res) => {
  const { userId, productName, username, issueDescription, warrantyId } =
    req.body;

  console.log("Received request to /warranty/claim:", req.body);

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
    console.error("Error handling warranty claim:", error);
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

// Global Express error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Function to check database connection
const checkDbConnection = async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connection successful!");
    return true;
  } catch (error) {
    // Log error but do not exit immediately
    console.error("Database connection failed:", error.message);
    return false;
  }
};

// Function that waits for database before starting the server
const startServer = async () => {
  console.log("Attempting to connect to database...");
  let dbConnected = false;
  const maxRetries = 30; // Retry up to ~150 seconds
  let retryCount = 0;

  while (!dbConnected && retryCount < maxRetries) {
    dbConnected = await checkDbConnection();
    if (!dbConnected) {
      retryCount++;
      console.log(
        `Retrying database connection in 5 seconds... Attempt ${retryCount}/${maxRetries}`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
    }
  }

  if (!dbConnected) {
    console.error(
      "Failed to connect to database after multiple retries. Exiting."
    );
  }

  // Start the server only after successful database connection
  const server = app.listen(PORT, "0.0.0.0", () => {
    // Uhvatite instancu servera
    console.log(`Server running on port ${PORT} and binding to 0.0.0.0`);
    console.log(`Express app.listen callback executed.`); // Dodajte novi log ovde
  });

  // Attach error handlers for the server
  server.on("error", (err) => {
    console.error("FATAL ERROR: Express Server emitted an error:");
    console.error(err.message);
    console.error(err.stack || err);
  });

  // Log server close event
  server.on("close", () => {
    console.log("Express Server closed.");
  });

  console.log(
    "app.listen called and listeners attached. Setting up alive check..."
  );
  setInterval(() => {
    console.log("Backend process is still alive...");
  }, 30000);

  // Log every 30 seconds to indicate the backend is still running
  console.log("startServer function completed its setup.");
};

// Call startup function
startServer().catch((err) => {
  console.error("Error during server startup process:", err.stack || err);
});

// Global handlers for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("FATAL ERROR: Uncaught Exception");
  console.error(err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL ERROR: Unhandled Rejection at:");
  console.error(promise);
  console.error("Reason:");
  console.error(reason.stack || reason);
});
