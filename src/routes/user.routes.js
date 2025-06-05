import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { createError } from "../utils/createError.js";

const router = express.Router();

// Protected route - get current user profile
router.get("/me", protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.profile.first_name,
          lastName: req.profile.last_name,
          role: req.profile.role,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Error fetching user profile"));
  }
});

// Protected route - update user profile (example of a protected route that modifies data)
router.patch("/me", protect, async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from("Users")
      .update({ first_name, last_name })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      return next(createError(500, "Error updating profile"));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: updatedProfile.first_name,
          lastName: updatedProfile.last_name,
          role: updatedProfile.role,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Error updating profile"));
  }
});

// Admin only route - example of role-based protection
router.get("/admin-only", protect, restrictTo("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome admin!",
    data: {
      user: req.profile,
    },
  });
});

export default router;
