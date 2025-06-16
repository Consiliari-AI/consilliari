import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getResumeAnalysis } from "../controllers/resumeAnalysis.controller.js";

const router = express.Router();

router.get("/analyze", protect, getResumeAnalysis);

export default router;
