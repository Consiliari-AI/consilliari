import { z } from "zod";

const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .max(100, "Password must not exceed 100 characters");

const nameSchema = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must not exceed 50 characters")
  .regex(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const signupSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase().trim()),

  password: passwordSchema,
  full_name: nameSchema.min(2, "Full name must be at least 2 characters long").max(100, "Full name must not exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase().trim()),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        required_error: "Current password is required",
        invalid_type_error: "Current password must be a string",
      })
      .min(1, "Current password is required"),

    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
