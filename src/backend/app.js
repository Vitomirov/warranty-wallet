// src/backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Import your application routers
import authRoutes from "./auth/auth.route.js";
import warrantiesRoutes from "./warranty/warranty.route.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";
import db from "./config/db.js";
import warrantyClaimHandler from "./handlers/warrantyClaimHandler.js";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Create Express app
const app = express();

// Allowed CORS origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://devitowarranty.xyz", "https://www.devitowarranty.xyz"]
    : ["http://localhost:5173"];

// Global middleware
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

// Health check routes
app.get("/api/testdb", async (req, res) => {
  try {
    const [results] = await db.query("SELECT 1");
    res.send(`Database connection successful: ${JSON.stringify(results)}`);
  } catch (error) {
    res.status(500).send("Database query error");
  }
});

app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

// Routes
app.use("/api/warranties", warrantiesRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/ai", aiRoutes);

// Warranty claim email route
app.post("/api/warranty/claim", warrantyClaimHandler);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

export default app;
