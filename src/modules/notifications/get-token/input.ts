import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const getTokenInputSchema = z.object({
  userId: mongoIdSchema,
  type: z.enum(["provider", "customer"]),
});

export type GetTokenInput = z.infer<typeof getTokenInputSchema>;
