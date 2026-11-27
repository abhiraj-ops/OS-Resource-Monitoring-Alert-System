import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  ageConsent: z.boolean().refine((val) => val === true, "You must confirm your age"),
  termsConsent: z.boolean().refine((val) => val === true, "You must agree to the Terms of Service"),
  privacyConsent: z.boolean().refine((val) => val === true, "You must agree to the Privacy Policy"),
  marketingConsent: z.boolean().optional(),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
