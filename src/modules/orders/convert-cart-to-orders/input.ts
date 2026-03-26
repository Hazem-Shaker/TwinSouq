import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  totalPrice: z.number(),
  products: z.array(
    z.object({
      id: mongoIdSchema,
      variant: mongoIdSchema,
      provider: mongoIdSchema,
      quantity: z.number(),
      name_ar: z.string(),
      name_en: z.string(),
      description_ar: z.string(),
      description_en: z.string(),
      price: z.number(),
      salePrice: z.number(),
      salePercent: z.number(),
      image: z.object({
        url: z.string(),
      }),
      profitPercent: z.number(),
      options: z.array(
        z.object({
          name_ar: z.string(),
          name_en: z.string(),
          value_ar: z.string(),
          value_en: z.string(),
        })
      ),
    })
  ),
  id: mongoIdSchema,
});

export type Input = z.infer<typeof inputSchema>;
