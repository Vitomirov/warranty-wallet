console.log("db.js called!");

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chose env file on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../../" + envFile) });

console.log("Loaded env file:", envFile);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// Function to create a MySQL connection pool with retry logic
const createPoolWithRetry = async (attempt = 1) => {
  try {
    console.log("DB_PASSWORD before pool creation:", process.env.DB_PASSWORD); // Log password before pool creation

    if (!process.env.DB_PASSWORD) {
      console.error("DB_PASSWORD is undefined or not set.");
      throw new Error("DB_PASSWORD is undefined or not set.");
    }

    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 10,
    });

    // Test the connection
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    connection.release(); // Release the connection back to the pool
    return pool; // Return the pool
  } catch (error) {
    console.error(
      `Attempt ${attempt}: Failed to create MySQL pool. Error: ${error.message}`
    );
    if (attempt < 5) {
      // Retry after a delay
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return createPoolWithRetry(attempt + 1); // Retry creating the pool
    } else {
      throw new Error("Failed to create MySQL pool after multiple attempts");
    }
  }
};

// Create the database connection pool
const db = await createPoolWithRetry();
export default db;
