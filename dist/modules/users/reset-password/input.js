"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordInputSchema = exports.otpVerifyInputSchema = exports.requestResetPasswordInputSchema = void 0;
const zod_1 = require("zod");
exports.requestResetPasswordInputSchema = zod_1.z.object({
    email: zod_1.z
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
exports.otpVerifyInputSchema = zod_1.z.object({
    email: zod_1.z
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
    otp: zod_1.z
        .any()
        .refine((value) => value, {
        message: "user_otp_missing",
    })
        .refine((value) => typeof value === "string" && value.length === 4, {
        message: "user_otp_wrong_type",
    }),
});
exports.resetPasswordInputSchema = zod_1.z.object({
    password: zod_1.z
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
    token: zod_1.z.any().refine((value) => value && typeof value === "string", {
        message: "user_token_missing",
    }),
});
