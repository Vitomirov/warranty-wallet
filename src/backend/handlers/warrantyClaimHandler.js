import fs from "fs";
import db from "../config/db.js";
import { resolveWarrantyPdfPath } from "../core/resolveWarrantyPdfPath.js";
import { sendWarrantyClaimEmail } from "../email/email.service.js";
/**
 * Handles warranty claim email sending
 */
export default async function warrantyClaimHandler(req, res) {
  const { userId, productName, username, issueDescription, warrantyId } =
    req.body;

  try {
    // Fetch warranty
    const [warranties] = await db.query(
      "SELECT sellersEmail, pdfFilePath FROM warranties WHERE warrantyId = ?",
      [warrantyId]
    );
    if (warranties.length === 0)
      return res.status(404).send("Warranty not found");

    const { sellersEmail, pdfFilePath: storedPdfPath } = warranties[0];
    const pdfFilePath = resolveWarrantyPdfPath(storedPdfPath);
    if (!pdfFilePath) {
      return res.status(400).send(
        "Warranty PDF is missing on the server. Please re-upload the warranty document."
      );
    }
    if (fs.statSync(pdfFilePath).size === 0) {
      return res.status(400).send("File is empty");
    }

    // Fetch user info
    const [users] = await db.query(
      "SELECT userEmail, fullName, userAddress, userPhoneNumber FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) return res.status(404).send("User not found");

    const { userEmail, fullName, userAddress, userPhoneNumber } = users[0];

    // Send email
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
    console.error("Warranty claim error:", error);
    res.status(500).send("Internal server error: " + error.message);
  }
}
