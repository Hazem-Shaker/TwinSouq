import { z } from "zod";

export const inputSchema = z.object({
  name: z
    .any()
    .refine((value) => value, {
      message: "user_name_missing",
    })
    .refine((value) => typeof value === "string" && value.length > 3, {
      message: "user_name_wrong_type",
    }),
  email: z
    .any()
    .refine((value) => value, {
      message: "user_email_missing",
    })
    .refine((value) => typeof value === "string" && value.length > 3, {
      message: "user_email_wrong_type",
    })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "user_email_invalid",
    }), // Validate email format
  password: z
    .any()
    .refine((value) => value, {
      message: "user_password_missing",
    })
    .refine((value) => typeof value === "string" && value.length > 8, {
      message: "user_password_too_short",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "user_password_missing_uppercase",
    }) // At least one uppercase letter
    .refine((value) => /[a-z]/.test(value), {
      message: "user_password_missing_lowercase",
    }) // At least one lowercase letter
    .refine((value) => /[0-9]/.test(value), {
      message: "user_password_missing_number",
    }) // At least one number
    .refine((value) => /[^A-Za-z0-9]/.test(value), {
      message: "user_password_missing_special_char",
    }), // At least one special character
  phone: z
    .any()
    .refine((value) => value, {
      message: "user_phone_missing",
    })
    .refine((value) => typeof value === "string" && value.length > 3, {
      message: "user_phone_wrong_type",
    })
    .refine((value) => /^\d+$/.test(value), {
      message: "user_phone_invalid",
    }), // Validate phone number contains only digits
  role: z
    .any()
    .refine((value) => value, {
      message: "user_role_missing",
    })
    .refine(
      (value) =>
        typeof value === "string" && (value === "provider" || value === "user"),
      {
        message: "user_role_invalid",
      }
    ),
  address: z
    .any()
    .optional()
    .refine((value) => !value || typeof value === "string", {
      message: "user_address_invalid",
    }),
});

export type Input = z.infer<typeof inputSchema>;
