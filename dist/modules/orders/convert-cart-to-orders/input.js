"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    totalPrice: zod_1.z.number(),
    products: zod_1.z.array(zod_1.z.object({
        id: custom_checckers_1.mongoIdSchema,
        variant: custom_checckers_1.mongoIdSchema,
        provider: custom_checckers_1.mongoIdSchema,
        quantity: zod_1.z.number(),
        name_ar: zod_1.z.string(),
        name_en: zod_1.z.string(),
        description_ar: zod_1.z.string(),
        description_en: zod_1.z.string(),
        price: zod_1.z.number(),
        salePrice: zod_1.z.number(),
        salePercent: zod_1.z.number(),
        image: zod_1.z.object({
            url: zod_1.z.string(),
        }),
        profitPercent: zod_1.z.number(),
        options: zod_1.z.array(zod_1.z.object({
            name_ar: zod_1.z.string(),
            name_en: zod_1.z.string(),
            value_ar: zod_1.z.string(),
            value_en: zod_1.z.string(),
        })),
    })),
    id: custom_checckers_1.mongoIdSchema,
});
