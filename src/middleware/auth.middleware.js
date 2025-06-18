import { createError } from "../utils/createError.js";
import supabaseAdmin from "../lib/supabaseConfig.js";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(createError(401, "Not authenticated"));
    }
    if (!accessToken) {
      return await refreshAndContinue(req, res, next, refreshToken);
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    //if access token is invalid
    if (error || !user) {
      return await refreshAndContinue(req, res, next, refreshToken);
    }

    // If access token is valid
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return next(createError(401, "User profile not found"));
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    next(createError(401, "Not Authenticated"));
  }
};

async function refreshAndContinue(req, res, next, refreshToken) {
  try {
    const { data: refreshData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (refreshError || !refreshData?.session) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(createError(401, "Session expired. Please login again."));
    }

    // Set new tokens in cookies
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

    const profile = await prisma.user.findUnique({
      where: { id: refreshData.user.id },
    });

    if (!profile) {
      return next(createError(401, "User profile not found"));
    }

    req.user = refreshData.user;
    req.profile = profile;
    return next();
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(createError(401, "Not Authenticated"));
  }
}

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
