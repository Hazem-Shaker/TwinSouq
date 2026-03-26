"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    product: custom_checckers_1.mongoIdSchema,
    price: zod_1.z
        .any()
        .refine((value) => value, {
        message: "price_missing",
    })
        .refine((val) => !isNaN(Number(val)), {
        message: "price_wrong_type",
    })
        .transform((val) => Number(val))
        .optional(),
    images: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    })) // Minimum length of 1
        .max(6, { message: "images_max_length_6" })
        .optional(), // Maximum length of 6
    options: zod_1.z
        .any()
        .refine((value) => Array.isArray(value), {
        message: "options_must_be_array",
    })
        .refine((val) => val.every((item) => typeof item === "object" &&
        item !== null &&
        "key" in item &&
        typeof item.key === "string" &&
        "value" in item &&
        typeof item.value === "string"), {
        message: "options_must_be_array_of_objects_with_key_and_values",
    }),
    stock: zod_1.z
        .any()
        .refine((value) => value, {
        message: "stock_missing",
    })
        .refine((val) => {
        if (typeof val === "number") {
            return val >= 0;
        }
        const num = Number(val);
        return !isNaN(num) && num >= 0;
    }, {
        message: "stock_must_be_positive_or_zero",
    }),
    salePrice: zod_1.z
        .any()
        .refine((val) => {
        if (typeof val === "number") {
            return true;
        }
        if (typeof val === "string" && val.length === 0) {
            return true;
        }
        return !isNaN(Number(val));
    }, {
        message: "price_wrong_type",
    })
        .transform((val) => {
        if (typeof val === "string" && val.length === 0) {
            return null;
        }
        return Number(val);
    })
        .optional(),
});
