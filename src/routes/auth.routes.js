import express from "express";
import {
  signup,
  login,
  logout,
  resetPassword,
  confirmPasswordReset,
  getGoogleAuthUrl,
  handleGoogleCallback,
  confirmEmail,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validator.js";
import { signupSchema, loginSchema, resetPasswordSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/reset-password-confirm", confirmPasswordReset);
router.post("/confirm-email", confirmEmail);

router.get("/google", getGoogleAuthUrl);
router.post("/google/callback", handleGoogleCallback);

export default router;
