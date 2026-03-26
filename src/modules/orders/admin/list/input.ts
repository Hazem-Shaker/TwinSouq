import { z } from "zod";

export const inputSchema = z.object({
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
  query: z.object({
    paymentStatus: z.any().refine((value) => {
      if(!value) return true;
      return typeof value === "string" && ["paid", "failed"].includes(value);
    }),
    shippingStatus: z.any().refine(value=> {
      if(!value) return true;

      return typeof value === "string" && [""]
    })
  }),
});

export type Input = z.infer<typeof inputSchema>;
