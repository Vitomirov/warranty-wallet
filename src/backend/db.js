import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Function to create a MySQL connection pool with retry logic
const createPoolWithRetry = async (attempt = 1) => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 10,
    });

    // Test the connection
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release(); // Release the connection back to the pool
    return pool; // Return the pool
  } catch (error) {
    console.error(`Attempt ${attempt}: Failed to create MySQL pool. Error: ${error.message}`);
    if (attempt < 5) {
      // Retry after a delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      return createPoolWithRetry(attempt + 1); // Retry creating the pool
    } else {
      throw new Error('Failed to create MySQL pool after multiple attempts');
    }
  }
};

// Create the database connection pool
const db = await createPoolWithRetry();
export default db;