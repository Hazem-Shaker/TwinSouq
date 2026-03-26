import { z } from "zod";
import { mongoIdSchemaSpecialMessage } from "../../../shared/utils/custom-checckers";
export const inputSchema = z.object({
  id: mongoIdSchemaSpecialMessage("wrong_category_id"),
});

export type Input = z.infer<typeof inputSchema>;
