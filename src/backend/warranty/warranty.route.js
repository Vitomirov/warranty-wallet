import express from "express";
import { verifyToken } from "../auth/auth.middleware.js";
import {
  getWarranties,
  getWarranty,
  addWarranty,
  getWarrantyPDF,
  deleteWarranty,
} from "./warranty.controller.js";
import { uploadMiddleware } from "./warranty.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getWarranties);
router.get("/:id", verifyToken, getWarranty);
router.post("/", verifyToken, uploadMiddleware, addWarranty);
router.delete("/:id", verifyToken, deleteWarranty);
router.get("/pdf/:id", verifyToken, getWarrantyPDF);

export default router;
