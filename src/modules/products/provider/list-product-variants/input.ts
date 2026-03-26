import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";
export const inputSchema = z.object({
  provider: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  product: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
});

export type Input = z.infer<typeof inputSchema>;
