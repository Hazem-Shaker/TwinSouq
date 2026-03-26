"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
exports.inputSchema = zod_1.z.object({
    limit: zod_1.z
        .string()
        .optional()
        .refine((val) => val === undefined || (val !== "" && parseInt(val) > 0), {
        message: "Limit must be a positive integer",
    })
        .transform((val) => (val ? parseInt(val) : undefined)),
    skip: zod_1.z
        .string()
        .optional()
        .refine((val) => val === undefined || (val !== "" && parseInt(val) > 0), {
        message: "Page must be a positive integer",
    })
        .transform((val) => (val ? parseInt(val) : undefined)),
});
