import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createPoolWithRetry = async (attempt = 1) => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 10,
    });

    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return pool;
  } catch (error) {
    if (attempt < 5) {
      setTimeout(() => createPoolWithRetry(attempt + 1), 5000);
    } else {
      throw new Error('Failed to create MySQL pool');
    }
  }
};

const db = await createPoolWithRetry();
export default db;