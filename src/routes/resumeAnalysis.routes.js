import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateResumeAnalysis, getResumeAnalysisData } from "../controllers/resumeAnalysis.controller.js";

const router = express.Router();

router.post("/generate", protect, generateResumeAnalysis);
router.get("/latest", protect, getResumeAnalysisData);

export default router;
