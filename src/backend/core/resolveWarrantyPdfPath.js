import fs from "fs";
import path from "path";
import { uploadsDir } from "../config/uploads.js";

/** Resolve legacy DB paths to a file on disk (Docker path drift). */
export function resolveWarrantyPdfPath(storedPath) {
  if (!storedPath || typeof storedPath !== "string") return null;
  if (fs.existsSync(storedPath)) return storedPath;

  const basename = path.basename(storedPath);
  const candidates = [
    path.join(uploadsDir, basename),
    path.join("/app/src/backend/uploads", basename),
    path.join("/app/uploads", basename),
    path.join("/app/src/uploads", basename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}
