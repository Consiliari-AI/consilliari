import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateCareerGoals, getCareerGoalsData } from "../controllers/careerGoals.controller.js";

const router = express.Router();

router.post("/generate", protect, generateCareerGoals);
router.get("/latest", protect, getCareerGoalsData);

export default router; 