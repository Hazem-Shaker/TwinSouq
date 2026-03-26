import { z } from "zod";

export const inputSchema = z.object({
});

export type Input = z.infer<typeof inputSchema>;