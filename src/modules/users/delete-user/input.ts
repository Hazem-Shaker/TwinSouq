import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
});

export type Input = z.infer<typeof inputSchema>;
