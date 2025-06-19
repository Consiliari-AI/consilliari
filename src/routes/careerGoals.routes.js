import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateCareerGoals, getCareerGoalsData, updateMilestoneStatus } from "../controllers/careerGoals.controller.js";

const router = express.Router();

router.post("/generate", protect, generateCareerGoals);
router.get("/latest", protect, getCareerGoalsData);
router.put("/update-milestone/:goalId/:milestoneId", protect, updateMilestoneStatus);

export default router;
