import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { parseCV, completeOnboarding } from "../controllers/onboarding.controller.js";
import { upload } from "../utils/multer.js";
import { cvFileValidator } from "../validators/cvFile.validator.js";
import { validate } from "../middleware/validator.js";
import { onboardingSchema } from "../validators/onboarding.validator.js";
const router = express.Router();

router.post("/parse-cv", protect, upload.single("resume"), cvFileValidator, parseCV);
router.post("/completed", protect, validate(onboardingSchema), completeOnboarding);

export default router;
