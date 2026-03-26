import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  user: mongoIdSchema,
  installmentsOrderId: mongoIdSchemaSpecialMessage("order_id_missing"),
});

export type Input = z.infer<typeof inputSchema>;
