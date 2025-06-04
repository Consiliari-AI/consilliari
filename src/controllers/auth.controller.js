import { catchAsync } from "../utils/error.js";
import { createError } from "../utils/createError.js";
import { userDto } from "../dtos/auth.dto.js";

export const signup = catchAsync(async (req, res, next) => {
  const { email, password, full_name } = req.body;

  const { data: authData, error: authError } = await req.supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        full_name: full_name,
      },
    },
  });
  if (authError) {
    return next(createError(authError.status || 400, authError.message));
  }

  const { data: profile, error: profileCheckError } = await req.supabase.from("Users").select("*").eq("id", authData.user.id).maybeSingle();
  if (profileCheckError) {
    return next(createError(profileCheckError.status, profileCheckError.message));
  }
  if (profile) {
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      data: {
        user: userDto(profile.user),
      },
    });
  }

  const { error: profileError } = await req.supabase.from("Users").insert([
    {
      id: authData.user.id,
      full_name: full_name,
      email: email.toLowerCase(),
    },
  ]);

  if (profileError) {
    return next(createError(profileError.status, profileError.message));
  }

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: {
      user: userDto(authData.user),
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { data, error: authError } = await req.supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });
  if (authError) {
    return next(createError(authError.status || 400, authError.message));
  }
  const { data: profile, error: profileError } = await req.supabase.from("Users").select("*").eq("id", data.user.id).maybeSingle();
  if (profileError) {
    return next(createError(profileError.status, profileError.message));
  }
  if (!profile) {
    return next(createError(404, "User profile not found"));
  }

  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: 60 * 1000, // 1 hour
    path: "/",
  });

  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userDto(data.user),
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

  const { error } = await req.supabase.auth.signOut();
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

  const { error } = await req.supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${process.env.CLIENT_URL}/auth/reset-password`,
  });

  if (error) return next(createError(error.status || 400, error.message));

  res.status(200).json({
    success: true,
    message: "Password reset instructions sent to your email",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const { error } = await req.supabase.auth.updateUser({
    password,
  });

  if (error) return next(createError(error.status || 400, error.message));

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Add a refresh token endpoint
export const refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return next(createError(401, "No refresh token provided"));
  }

  const { data, error } = await req.supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) {
    // Clear cookies if refresh fails
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(createError(401, "Invalid refresh token"));
  }

  // Set new access token cookie
  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  // Set new refresh token cookie
  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      user: userDto(data.user),
    },
  });
});

export const getGoogleAuthUrl = catchAsync(async (req, res, next) => {
  const { data, error } = await req.supabase.auth.signInWithOAuth({
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
    return next(createError(400, "No callback URL provided"));
  }

  // Extract the access token and refresh token from the URL
  const urlObj = new URL(url);
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return next(createError(400, "No tokens provided in callback"));
  }
  const { data, error } = await req.supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return next(createError(error.status || 400, error.message));
  }

  const { data: profile, error: profileError } = await req.supabase.from("Users").select("*").eq("id", data.user.id).maybeSingle();

  if (!profile && !profileError) {
    const { error: insertError } = await req.supabase.from("Users").insert([
      {
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || "",
        email: data.user.email,
      },
    ]);

    if (insertError) {
      console.error("Profile creation error:", insertError);
      return next(createError(500, "Error creating user profile"));
    }
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
      user: userDto(data.user),
    },
  });
});
