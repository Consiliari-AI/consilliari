import express from "express";
import {
  signup,
  login,
  logout,
  resetPassword,
  updatePassword,
  refreshToken,
  getGoogleAuthUrl,
  handleGoogleCallback,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validator.js";
import { signupSchema, loginSchema, resetPasswordSchema, updatePasswordSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/update-password", validate(updatePasswordSchema), updatePassword);
router.post("/refresh-token", refreshToken);

router.get("/google", getGoogleAuthUrl);
router.post("/google/callback", handleGoogleCallback);

export default router;
