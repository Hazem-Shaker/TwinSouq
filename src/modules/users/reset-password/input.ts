import { z } from "zod";

export const requestResetPasswordInputSchema = z.object({
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
    }),
});

export type RequestResetPasswordInput = z.infer<
  typeof requestResetPasswordInputSchema
>;

export const otpVerifyInputSchema = z.object({
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
    }),
  otp: z
    .any()
    .refine((value) => value, {
      message: "user_otp_missing",
    })
    .refine((value) => typeof value === "string" && value.length === 4, {
      message: "user_otp_wrong_type",
    }),
});

export type OtpVerifyInput = z.infer<typeof otpVerifyInputSchema>;

export const resetPasswordInputSchema = z.object({
  password: z
    .any()
    .refine((value) => value && typeof value === "string", {
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
  token: z.any().refine((value) => value && typeof value === "string", {
    message: "user_token_missing",
  }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
