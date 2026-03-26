"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "provider_id_missing",
    }),
    variantId: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "variant_id_missing",
    }),
    data: zod_1.z.object({
        price: zod_1.z
            .any()
            .refine((val) => {
            if (!val)
                return true;
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
            if (!val)
                return null;
            if (typeof val === "string" && val.length === 0) {
                return null;
            }
            return Number(val);
        })
            .optional(),
        images: zod_1.z
            .array(zod_1.z.object({
            _id: custom_checckers_1.mongoIdSchema,
        })) // Minimum length of 1
            .max(6, { message: "images_max_length_6" })
            .optional(), // Maximum length of 6
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
        }).optional(),
        salePrice: zod_1.z
            .any()
            .refine((val) => {
            if (!val)
                return true;
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
            if (!val)
                return null;
            if (typeof val === "string" && val.length === 0) {
                return null;
            }
            return Number(val);
        })
            .optional(),
    }),
});
