import { z } from "zod";

export const inputSchema = z.object({
  slug: z.string(),
});

export type Input = z.infer<typeof inputSchema>;
