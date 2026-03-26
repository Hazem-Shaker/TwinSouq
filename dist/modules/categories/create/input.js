"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    name_ar: zod_1.z
        .any()
        .refine((val) => val, {
        message: "name_ar_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "name_ar_wrong_type",
    }),
    name_en: zod_1.z
        .any()
        .refine((val) => val, {
        message: "name_en_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "name_en_wrong_type",
    }),
    description_ar: zod_1.z
        .string()
        .nullable()
        .or(zod_1.z.null())
        .refine((val) => typeof val === "string", {
        message: "description_ar_wrong_type",
    })
        .optional(),
    description_en: zod_1.z
        .string()
        .nullable()
        .or(zod_1.z.null())
        .refine((val) => typeof val === "string", {
        message: "description_en_wrong_type",
    })
        .optional(),
    parent: custom_checckers_1.mongoIdSchema.optional(),
    profitPercentage: zod_1.z
        .preprocess((val) => (typeof val === "string" ? Number(val) : val), zod_1.z
        .number({ invalid_type_error: "profit_percentage_wrong_type" })
        .min(0, { message: "profit_percentage_min" })
        .max(100, { message: "profit_percentage_max" }))
        .optional(),
    image: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "image_missing" }), // Restrict array length to 1
});
