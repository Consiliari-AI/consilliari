import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { parseCV } from "../controllers/onboarding.controller.js";
import { upload } from "../utils/multer.js";
import { cvFileValidator } from "../validators/cvFile.validator.js";

const router = express.Router();

router.post("/parse-cv", protect, upload.single("cv"), cvFileValidator, parseCV);

export default router;
