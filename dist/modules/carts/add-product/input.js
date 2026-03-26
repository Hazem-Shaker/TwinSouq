"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    productId: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_product_id").refine((value) => value, {
        message: "product_id_missing",
    }),
    variantId: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_variant_id").refine((value) => value, {
        message: "variant_id_missing",
    }),
    quantity: zod_1.z
        .any()
        .refine((val) => !isNaN(Number(val)) &&
        Number(val) >= 0 &&
        Number.isInteger(Number(val)), {
        message: "quantity_invalid",
    })
        .transform((val) => Number(val)),
});
