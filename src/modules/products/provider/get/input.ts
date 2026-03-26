import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  provider: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  product: mongoIdSchema.refine((value) => value, {
    message: "product_id_missing",
  }),
});

export type Input = z.infer<typeof inputSchema>;
