// option.input.ts
import { z } from "zod";
import { mongoIdSchemaSpecialMessage } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  id: mongoIdSchemaSpecialMessage("option_id_missing"),
});

export type Input = z.infer<typeof inputSchema>;
