// option.input.ts
import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  categoryId: mongoIdSchema.refine((val) => val, {
    message: "category_id_missing",
  }),
});

export type Input = z.infer<typeof inputSchema>;
