import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  provider: mongoIdSchema,
  id: mongoIdSchemaSpecialMessage("invalid_order_id"),
});

export type Input = z.infer<typeof inputSchema>;
