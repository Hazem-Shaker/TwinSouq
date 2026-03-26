import { z } from "zod";
import {
  mongoIdSchema,
  stringSchema,
  mongoIdSchemaSpecialMessage,
} from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  id: mongoIdSchemaSpecialMessage("address_id"),
  owner: mongoIdSchema,
});

export type Input = z.infer<typeof inputSchema>;
