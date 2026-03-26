"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    product: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_product_id"),
    variant: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_variant_id"),
    address: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("address_missing"),
    installmentOption: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_installment_option"),
    accountStatement: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "account_statement_missing" }),
    salaryCertificate: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "salary_certificate_missing" }),
    contract: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "contract_missing" }),
    iban: zod_1.z.any().refine((value) => {
        return value && typeof value === "string";
    }),
});
