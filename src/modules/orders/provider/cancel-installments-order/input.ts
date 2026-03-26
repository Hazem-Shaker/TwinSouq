import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  id: mongoIdSchemaSpecialMessage("wrong_order_id"),
  provider: mongoIdSchemaSpecialMessage("wrong_provider_id"),
});

export type Input = z.infer<typeof inputSchema>;
