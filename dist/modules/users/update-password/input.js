"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    data: zod_1.z.object({
        password: zod_1.z.any().refine((value) => value, {
            message: "user_password_missing",
        }),
        newPassword: zod_1.z
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
    }),
    userId: custom_checckers_1.mongoIdSchema,
});
