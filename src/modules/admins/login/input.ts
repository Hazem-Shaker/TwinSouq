import { z } from "zod";

export const inputSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type Input = z.infer<typeof inputSchema>;
