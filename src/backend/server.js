// src/backend/server.js
import dotenv from "dotenv";
import app from "./app.js";
import db from "./config/db.js";
import { scheduleCronJobs } from "./cronJobs.js";

// Load environment variables
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const PORT = process.env.PORT || 3000;

// Check DB connection
async function checkDbConnection() {
  try {
    await db.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}

// Start server after DB connection
async function startServer() {
  let dbConnected = false;
  const maxRetries = 30;
  let retries = 0;

  while (!dbConnected && retries < maxRetries) {
    dbConnected = await checkDbConnection();
    if (!dbConnected) {
      retries++;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (!dbConnected) {
    console.error("DB unavailable after retries. Exiting...");
    process.exit(1);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {});

  server.on("error", (err) => {
    console.error("Server error:", err);
  });

  server.on("close", () => {});

  // Schedule cron jobs
  scheduleCronJobs();
}

startServer().catch((err) =>
  console.error("Fatal startup error:", err.stack || err)
);

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
