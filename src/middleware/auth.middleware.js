import { createError } from "../utils/createError.js";
import supabaseAdmin from "../lib/supabaseConfig.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken || !refreshToken) {
      return next(createError(401, "Not authenticated"));
    }
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) {
      const { data: refreshData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (refreshError || !refreshData?.session) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return next(createError(401, "Session expired. Please login again."));
      }
      res.cookie("access_token", refreshData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
        path: "/",
      });

      res.cookie("refresh_token", refreshData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      const { data: profile, error: profileError } = await supabaseAdmin.from("Users").select("*").eq("id", refreshData.user.id).single();

      if (profileError || !profile) {
        return next(createError(401, "User profile not found"));
      }

      req.user = refreshData.user;
      req.profile = profile;
      return next();
    }

    // If access token is already valid
    const { data: profile, error: profileError } = await supabaseAdmin.from("Users").select("*").eq("id", user.id).single();
    if (profileError || !profile) {
      return next(createError(401, "User profile not found"));
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    next(createError(401, "Authentication failed"));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.profile) {
      return next(createError(401, "Not authenticated"));
    }

    if (!roles.includes(req.profile.role)) {
      return next(createError(403, "Not authorized to perform this action"));
    }

    next();
  };
};
