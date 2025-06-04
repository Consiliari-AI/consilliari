import { createError } from "../utils/createError.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return next(createError(401, "Not authenticated - no token provided"));
    }

    const {
      data: { user },
      error,
    } = await req.supabase.auth.getUser(accessToken);

    if (error || !user) {
      return next(createError(401, "Not authenticated - invalid token"));
    }

    const { data: profile, error: profileError } = await req.supabase.from("Users").select("*").eq("id", user.id).single();

    if (profileError || !profile) {
      return next(createError(401, "User profile not found"));
    }

    req.user = user;
    req.profile = profile;

    next();
  } catch (error) {
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
