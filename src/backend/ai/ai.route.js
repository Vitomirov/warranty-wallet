import express from "express";
import { handleAiRequest } from "./ai.controller.js";

const router = express.Router();

router.post("/", handleAiRequest);

export default router;
