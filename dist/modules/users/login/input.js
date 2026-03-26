"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
exports.inputSchema = zod_1.z.object({
    email: zod_1.z
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
    password: zod_1.z.any().refine((value) => value, {
        message: "user_password_missing", // Error message key for missing password
    }),
    role: zod_1.z
        .any()
        .refine((value) => value, {
        message: "user_role_missing", // Error message key for missing role
    })
        .refine((value) => typeof value === "string" && (value === "provider" || value === "user"), {
        message: "user_role_invalid", // Error message key for invalid role
    }),
});
