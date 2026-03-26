import { z } from "zod";

export const inputSchema = z.object({
  email: z
    .any()
    .refine((value) => value, {
      message: "user_email_missing", // Error message key for missing email
    })
    .refine((value) => typeof value === "string" && value.length > 0, {
      message: "user_email_wrong_type", // Error message key for invalid email type
    })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "user_email_invalid", // Error message key for invalid email format
    }),

  password: z.any().refine((value) => value, {
    message: "user_password_missing", // Error message key for missing password
  }),
  role: z
    .any()
    .refine((value) => value, {
      message: "user_role_missing", // Error message key for missing role
    })
    .refine(
      (value) =>
        typeof value === "string" && (value === "provider" || value === "user"),
      {
        message: "user_role_invalid", // Error message key for invalid role
      }
    ),
});

export type Input = z.infer<typeof inputSchema>;
