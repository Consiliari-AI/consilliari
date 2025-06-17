import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateCOS, getCOSAnalysisData } from "../controllers/cos.controller.js";

const router = express.Router();

router.post("/generate", protect, generateCOS);

router.get("/latest", protect, getCOSAnalysisData);

export default router;
