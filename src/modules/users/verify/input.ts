import { z } from "zod";

export const veirfyInputSchema = z.object({
  otp: z
    .any()
    .refine((value) => value, {
      message: "user_otp_missing",
    })
    .refine((value) => typeof value === "string" && value.length === 4, {
      message: "user_otp_wrong_type",
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
    }),
});

export type VerifyInput = z.infer<typeof veirfyInputSchema>;

export const resendOtpInputSchema = z.object({
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

export type ResendOtpInput = z.infer<typeof resendOtpInputSchema>;
