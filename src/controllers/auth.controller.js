import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { userDto } from "../dtos/auth.dto.js";
import { findUserById, createUser, updateUserEmailVerification, findUserByEmail } from "../services/auth.service.js";
import supabaseAdmin from "../lib/supabaseConfig.js";

export const signup = catchAsync(async (req, res, next) => {
  const { email, password, full_name } = req.body;

  const existingUser = await findUserByEmail(email.toLowerCase());
  if (existingUser) {
    return next(createError(400, "Email already in use."));
  }
  const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        full_name: full_name,
      },
      emailRedirectTo: `${process.env.CLIENT_URL}/auth/confirm-email`,
    },
  });

  if (authError) {
    return next(createError(authError.status || 400, authError.message));
  }

  const userProfile = await createUser({
    id: authData.user.id,
    email: email.toLowerCase(),
    full_name: full_name,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful. Please check your email for verification.",
    data: {
      user: userDto(userProfile),
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });
  if (authError) {
    return next(createError(authError.status || 400, authError.message));
  }

  const profile = await findUserById(data.user.id);
  if (!profile) {
    return next(createError(404, "User profile not found"));
  }

  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userDto(profile),
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  const { error } = await supabaseAdmin.auth.signOut();
  if (error) {
    return next(createError(error.status || 400, error.message));
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${process.env.CLIENT_URL}/auth/reset-password`,
  });

  if (error) return next(createError(error.status || 400, error.message));

  res.status(200).json({
    success: true,
    message: "Password reset instructions sent to your email",
  });
});

export const confirmPasswordReset = catchAsync(async (req, res, next) => {
  const { url, newPassword } = req.body;
  console.log("req", req.body);
  if (!url || !newPassword) {
    return next(createError(400, "url and new password are required"));
  }
  const urlObj = new URL(url);
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return next(createError(400, "Invalid or expired token"));
  }

  const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    return next(createError(sessionError.status || 401, sessionError.message));
  }
  const { data: updateData, error: updateError } = await supabaseAdmin.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(createError(updateError.status || 400, updateError.message));
  }

  if (!sessionData || !sessionData.session) {
    return next(createError(200, "Password updated successfully"));
  }

  res.cookie("access_token", sessionData.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  res.cookie("refresh_token", sessionData.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const getGoogleAuthUrl = catchAsync(async (req, res, next) => {
  const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.CLIENT_URL}/auth/google/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return next(createError(error.status || 400, error.message));
  }
  res.status(200).json({
    success: true,
    data: {
      url: data.url,
    },
  });
});

export const handleGoogleCallback = catchAsync(async (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    return next(createError(400, "No URL provided"));
  }

  const urlObj = new URL(url);
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return next(createError(400, "Invalid or expired token"));
  }

  const { data, error } = await supabaseAdmin.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return next(createError(error.status || 400, error.message));
  }

  let profile = await findUserById(data.user.id);

  if (!profile) {
    profile = await createUser({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || "",
    });
  }

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Google authentication successful",
    data: {
      user: userDto(profile),
    },
  });
});

export const confirmEmail = catchAsync(async (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return next(createError(400, "Confirmation URL is required"));
  }

  const urlObj = new URL(url);
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return next(createError(400, "Invalid or expired confirmation link"));
  }

  const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    return next(createError(sessionError.status || 401, sessionError.message));
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

  if (userError) {
    return next(createError(userError.status || 400, userError.message));
  }

  if (!userData.user.email_confirmed_at) {
    return next(createError(400, "Email confirmation failed"));
  }

  const updatedUser = await updateUserEmailVerification(userData.user.id);

  res.cookie("access_token", sessionData.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  res.cookie("refresh_token", sessionData.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      user: userDto(updatedUser),
    },
  });
});
