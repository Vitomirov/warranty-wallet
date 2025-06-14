import express from "express";
import warrantiesRouter from "./warranties.js";
import { login, refreshToken, signup } from "./auth.functions.js";

const router = express.Router();

// Rute koje ne zahtevaju verifikaciju tokena
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/signup", signup);

// Dodavanje zasticenih ruta
router.use("/warranties", warrantiesRouter);

// Koriscenje routera
export default router;
