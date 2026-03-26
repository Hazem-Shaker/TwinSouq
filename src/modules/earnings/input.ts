import { z } from "zod";
import { mongoIdSchema } from "../../shared/utils/custom-checckers";

export const createOrderEarningInputSchema = z.object({
  order: mongoIdSchema,
  amount: z.number(),
  provider: mongoIdSchema,
  product: z.object({
    id: mongoIdSchema,
    variant: mongoIdSchema,
    price: z.number(),
    profitPercent: z.number(),
    quantity: z.number(),
  }),
  status: z.enum(["pending", "available", "withdrawn"]),
});

export type CreateOrderEarningInput = z.infer<
  typeof createOrderEarningInputSchema
>;

export const createInstallmentEarningInputSchema = z.object({
  order: mongoIdSchema,
  amount: z.number(),
  provider: mongoIdSchema,
  product: z.object({
    id: mongoIdSchema,
    variant: mongoIdSchema,
    price: z.number(),
    profitPercent: z.number(),
  }),
  status: z.enum(["pending", "available", "withdrawn"]),
});

export type CreateInstallmentEarningInput = z.infer<
  typeof createInstallmentEarningInputSchema
>;

export const getWalletBalanceInputSchema = z.object({
  provider: mongoIdSchema,
});

export type GetWalletBalanceInput = z.infer<typeof getWalletBalanceInputSchema>;

export const withdrawInputSchema = z.object({
  provider: mongoIdSchema,
  iban: z.string(),
});

export type WithdrawInput = z.infer<typeof withdrawInputSchema>;

export const confirmPayoutInputSchema = z.object({
  payout: mongoIdSchema,
});

export type ConfirmPayoutInput = z.infer<typeof confirmPayoutInputSchema>;

export const getPayoutsForAdminInputSchema = z.object({
  query: z.object({
    status: z.enum(["pending", "paid"]).optional(),
  }),
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
});

export type GetPayoutsForAdminInput = z.infer<
  typeof getPayoutsForAdminInputSchema
>;
