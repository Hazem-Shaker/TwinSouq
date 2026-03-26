import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  orderId: mongoIdSchemaSpecialMessage("wrong_order_id"),
});

export type Input = z.infer<typeof inputSchema>;
