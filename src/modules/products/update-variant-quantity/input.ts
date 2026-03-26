import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.array(
  z.object({
    variant: mongoIdSchema,
    quantity: z.number(),
  })
);

export type Input = z.infer<typeof inputSchema>;
