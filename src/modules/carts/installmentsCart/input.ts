import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../shared/utils/custom-checckers";

export const addToCartInputSchema = z.object({
  user: mongoIdSchema,
  product: mongoIdSchemaSpecialMessage("invalid_product_id"),
  variant: mongoIdSchemaSpecialMessage("invalid_variant_id"),
  installmentOption: mongoIdSchemaSpecialMessage("invalid_installment_option"),
});

export type AddToCartInput = z.infer<typeof addToCartInputSchema>;

export const getCartInputSchema = z.object({
  user: mongoIdSchema,
});

export type GetCartInput = z.infer<typeof getCartInputSchema>;

export const removeFromCartInputSchema = z.object({
  user: mongoIdSchema,
  product: mongoIdSchemaSpecialMessage("invalid_product_id"),
});

export type RemoveFromCartInput = z.infer<typeof removeFromCartInputSchema>;
