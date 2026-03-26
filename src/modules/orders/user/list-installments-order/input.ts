import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
  query: z.object({
    status: z.any().refine((value) => {
      if (!value) return true;
      return (
        typeof value === "string" &&
        ["sent", "approved", "rejected"].includes(value)
      );
    }),
    paymentStatus: z.any().refine((value) => {
      if (!value) return true;
      return (
        typeof value === "string" &&
        ["first-payment", "late-payment", "next-payment", "done"].includes(
          value
        )
      );
    }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
