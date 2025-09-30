import db from "./config/db.js";

// Test the database connection
const testConnection = async () => {
  try {
    const [results] = await db.query("SELECT 1");
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
};

testConnection();
