import { z } from "zod";
import {
  mongoIdSchema,
  stringSchema,
} from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  owner: mongoIdSchema,
});

export type Input = z.infer<typeof inputSchema>;
