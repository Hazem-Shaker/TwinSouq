"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCartInputSchema = exports.getCartInputSchema = exports.addToCartInputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.addToCartInputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    product: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_product_id"),
    variant: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_variant_id"),
    installmentOption: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_installment_option"),
});
exports.getCartInputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
});
exports.removeFromCartInputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    product: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_product_id"),
});
