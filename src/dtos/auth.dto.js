export const userDto = (user) => {
  return {
    id: user?.id,
    email: user?.email,
    full_name: user?.user_metadata?.full_name || "",
    email_verified: user?.user_metadata?.email_verified || false,
  };
};
