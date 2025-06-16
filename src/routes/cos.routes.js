import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { calculateCOS } from "../controllers/cos.controller.js";

const router = express.Router();

router.get("/calculate", protect, calculateCOS);

export default router; 