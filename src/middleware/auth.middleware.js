import { createError } from '../utils/createError.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return next(createError(401, 'Not authenticated - no token provided'));
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await req.supabase.auth.getUser(accessToken);

    if (error || !user) {
      return next(createError(401, 'Not authenticated - invalid token'));
    }

    // Get user profile
    const { data: profile, error: profileError } = await req.supabase
      .from('Users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return next(createError(401, 'User profile not found'));
    }

    // Attach user and profile to request object
    req.user = user;
    req.profile = profile;

    next();
  } catch (error) {
    next(createError(401, 'Authentication failed'));
  }
};

// Optional: Role-based middleware
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.profile) {
      return next(createError(401, 'Not authenticated'));
    }

    if (!roles.includes(req.profile.role)) {
      return next(createError(403, 'Not authorized to perform this action'));
    }

    next();
  };
}; 