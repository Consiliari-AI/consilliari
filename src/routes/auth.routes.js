import express from "express";
import { signup, login, logout, resetPassword, updatePassword } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validator.js";
import { loginSchema, signupSchema, resetPasswordSchema, updatePasswordSchema } from "../dtos/auth.dto.js";

const router = express.Router();

// Auth routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/update-password", validate(updatePasswordSchema), updatePassword);

export default router;
