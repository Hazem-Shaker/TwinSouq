import { z } from "zod";
import { mongoIdSchemaSpecialMessage } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  orderId: mongoIdSchemaSpecialMessage("invalid_order_id"),
  shippingStatus: z.any().refine((value) => {
    return (
      value &&
      typeof value === "string" &&
      ["shipped", "delivered"].includes(value)
    );
  }),
});

export type Input = z.infer<typeof inputSchema>;
