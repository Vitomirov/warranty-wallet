import pool from "../config/db.js";

export const logActivity = async (user, action, details) => {
  if (!user) return;

  let { userId, username, fullName } = user;

  // Ako nedostaju username/fullName, povuci ih iz baze
  if (!username || !fullName) {
    const [result] = await pool.query(
      "SELECT username, fullName FROM users WHERE id = ?",
      [userId]
    );

    if (result.length > 0) {
      username = result[0].username;
      fullName = result[0].fullName;
    }
  }

  await pool.query(
    "INSERT INTO logs (userId, username, fullName, action, details) VALUES (?, ?, ?, ?, ?)",
    [userId, username, fullName, action, details]
  );
};
