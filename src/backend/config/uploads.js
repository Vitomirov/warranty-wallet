import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Canonical PDF dir — same as Express static `/uploads` in app.js */
export const uploadsDir = path.join(__dirname, "..", "uploads");
