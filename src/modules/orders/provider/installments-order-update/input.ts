import { z } from "zod";
import {
  mongoIdSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../../shared/utils/custom-checckers";
export const inputSchema = z.object({
  provider: mongoIdSchema,
  id: mongoIdSchemaSpecialMessage("invalid_order_id"),
  status: z
    .any()
    .refine(
      (value) =>
        typeof value === "string" && ["approved", "rejected"].includes(value),
      {
        message: "invalid_status",
      }
    ),
});

export type Input = z.infer<typeof inputSchema>;
