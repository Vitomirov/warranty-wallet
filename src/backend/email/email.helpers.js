import fs from "fs";

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
