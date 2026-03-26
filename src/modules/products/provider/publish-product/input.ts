import { z } from "zod";
import { mongoIdSchemaSpecialMessage } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  provider: mongoIdSchemaSpecialMessage("provider_id_wrong_value"),
  id: mongoIdSchemaSpecialMessage("product_id_wrong_value"),
});

export type Input = z.infer<typeof inputSchema>;
