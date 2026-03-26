"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpInputSchema = exports.veirfyInputSchema = void 0;
const zod_1 = require("zod");
exports.veirfyInputSchema = zod_1.z.object({
    otp: zod_1.z
        .any()
        .refine((value) => value, {
        message: "user_otp_missing",
    })
        .refine((value) => typeof value === "string" && value.length === 4, {
        message: "user_otp_wrong_type",
    }),
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
exports.resendOtpInputSchema = zod_1.z.object({
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
