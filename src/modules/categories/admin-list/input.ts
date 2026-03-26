import { z } from "zod";

export const inputSchema = z.object({
  limit: z
    .string()
    .optional()
    .refine((val) => val === undefined || (val !== "" && parseInt(val) > 0), {
      message: "Limit must be a positive integer",
    })
    .transform((val) => (val ? parseInt(val) : undefined)),
  skip: z
    .string()
    .optional()
    .refine((val) => val === undefined || (val !== "" && parseInt(val) > 0), {
      message: "Page must be a positive integer",
    })
    .transform((val) => (val ? parseInt(val) : undefined)),
});

export type Input = z.infer<typeof inputSchema>;