import fs from "fs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Ensures MAIL_FROM_ADDRESS is a real email (not an API key pasted by mistake). */
export function getMailFromAddress() {
  const raw = process.env.MAIL_FROM_ADDRESS?.trim();
  if (!raw) {
    throw new Error("MAIL_FROM_ADDRESS is not configured");
  }
  if (!EMAIL_RE.test(raw)) {
    throw new Error(
      "MAIL_FROM_ADDRESS must be a verified sender email (e.g. noreply@mg.yourdomain.com), not an API key"
    );
  }
  return raw;
}

export function formatClaimFromHeader(fullName, mailFrom) {
  const safeName = (fullName || "Customer").replace(/["\\]/g, "").trim();
  return `"${safeName} via Warranty Wallet" <${mailFrom}>`;
}

export function validatePdfFile(pdfFilePath) {
  if (!pdfFilePath || typeof pdfFilePath !== "string") {
    console.error("Invalid PDF file path:", pdfFilePath);
    throw new Error("Invalid PDF file path");
  }

  if (!fs.existsSync(pdfFilePath)) {
    console.error("File does not exist:", pdfFilePath);
    throw new Error("File does not exist");
  }

  const stats = fs.statSync(pdfFilePath);
  if (stats.size === 0) {
    console.error("File is empty:", pdfFilePath);
    throw new Error("File is empty");
  }
}
