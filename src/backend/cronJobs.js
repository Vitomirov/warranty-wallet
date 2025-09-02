import cron from "node-cron";
import db from "./db.js";
import { sendExpirationNotificationEmail } from "./routes/email.js";

/**
 * Check for warranties expiring within 14 days
 */
async function checkForNearlyExpiredWarranties() {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date(currentDate);
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  try {
    const [warranties] = await db.promise().query(
      `SELECT w.warrantyId, w.sellersEmail, u.userEmail, u.fullName, w.productName
         FROM warranties w 
         JOIN users u ON w.userId = u.id 
         WHERE w.warrantyExpireDate BETWEEN ? AND ? AND w.notified = 0`,
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
      } catch (err) {
        console.error(
          `Error sending expiration email for warranty ${warranty.warrantyId}:`,
          err
        );
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
}

// Schedule job every day at 9 AM
export function scheduleCronJobs() {
  cron.schedule("0 9 * * *", checkForNearlyExpiredWarranties);
}
