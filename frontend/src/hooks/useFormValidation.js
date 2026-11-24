import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  ageConsent: z.boolean().refine((val) => val === true, {
    message: "You must confirm you are 13 years or older",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function useFormValidation(schema, onSubmit) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setServerError("");

    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const result = schema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path && issue.path.length > 0) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return { errors, submitting, serverError, handleSubmit, setErrors, setServerError };
}

import { useState } from "react";
