import { z } from "zod";
import {
  mongoIdSchemaSpecialMessage,
  mongoIdSchema,
} from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  productId: mongoIdSchemaSpecialMessage("invalid_product_id").refine(
    (value) => value,
    {
      message: "product_id_missing",
    }
  ),
  variantId: mongoIdSchemaSpecialMessage("invalid_variant_id").refine(
    (value) => value,
    {
      message: "variant_id_missing",
    }
  ),
  quantity: z
    .any()
    .refine(
      (val) =>
        !isNaN(Number(val)) &&
        Number(val) >= 0 &&
        Number.isInteger(Number(val)),
      {
        message: "quantity_invalid",
      }
    )
    .transform((val) => Number(val)),
});

export type Input = z.infer<typeof inputSchema>;
