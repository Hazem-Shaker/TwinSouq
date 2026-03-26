"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionInputSchema = void 0;
// option.input.ts
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.optionInputSchema = zod_1.z.object({
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
    values: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z
            .any()
            .refine((val) => val, {
            message: "value_id_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "value_id_wrong_type",
        }),
        name_ar: zod_1.z
            .any()
            .refine((val) => val, {
            message: "value_name_ar_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "value_name_ar_wrong_type",
        }),
        name_en: zod_1.z
            .any()
            .refine((val) => val, {
            message: "value_name_en_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "value_name_en_wrong_type",
        }),
        metadata: zod_1.z.record(zod_1.z.any()).optional(), // Optional metadata
    }))
        .min(1, { message: "values_missing" }), // At least one value is required
    category: custom_checckers_1.mongoIdSchema.refine((val) => val, {
        message: "category_id_missing",
    }),
});
