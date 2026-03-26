"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayoutsForAdminInputSchema = exports.confirmPayoutInputSchema = exports.withdrawInputSchema = exports.getWalletBalanceInputSchema = exports.createInstallmentEarningInputSchema = exports.createOrderEarningInputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../shared/utils/custom-checckers");
exports.createOrderEarningInputSchema = zod_1.z.object({
    order: custom_checckers_1.mongoIdSchema,
    amount: zod_1.z.number(),
    provider: custom_checckers_1.mongoIdSchema,
    product: zod_1.z.object({
        id: custom_checckers_1.mongoIdSchema,
        variant: custom_checckers_1.mongoIdSchema,
        price: zod_1.z.number(),
        profitPercent: zod_1.z.number(),
        quantity: zod_1.z.number(),
    }),
    status: zod_1.z.enum(["pending", "available", "withdrawn"]),
});
exports.createInstallmentEarningInputSchema = zod_1.z.object({
    order: custom_checckers_1.mongoIdSchema,
    amount: zod_1.z.number(),
    provider: custom_checckers_1.mongoIdSchema,
    product: zod_1.z.object({
        id: custom_checckers_1.mongoIdSchema,
        variant: custom_checckers_1.mongoIdSchema,
        price: zod_1.z.number(),
        profitPercent: zod_1.z.number(),
    }),
    status: zod_1.z.enum(["pending", "available", "withdrawn"]),
});
exports.getWalletBalanceInputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema,
});
exports.withdrawInputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema,
    iban: zod_1.z.string(),
});
exports.confirmPayoutInputSchema = zod_1.z.object({
    payout: custom_checckers_1.mongoIdSchema,
});
exports.getPayoutsForAdminInputSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(["pending", "paid"]).optional(),
    }),
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
});
