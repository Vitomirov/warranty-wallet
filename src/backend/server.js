// src/backend/server.js
import dotenv from "dotenv";
import app from "./app.js";
import db from "./db.js";
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
    console.log("Database connection successful!");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}

// Start server after DB connection
async function startServer() {
  console.log("Attempting to connect to database...");
  let dbConnected = false;
  const maxRetries = 30;
  let retries = 0;

  while (!dbConnected && retries < maxRetries) {
    dbConnected = await checkDbConnection();
    if (!dbConnected) {
      retries++;
      console.log(`Retrying DB in 5s... Attempt ${retries}/${maxRetries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (!dbConnected) {
    console.error("DB unavailable after retries. Exiting...");
    process.exit(1);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
  });

  server.on("close", () => {
    console.log("Server closed.");
  });

  // Keep process alive logs
  setInterval(() => console.log("Backend is alive..."), 30000);

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
