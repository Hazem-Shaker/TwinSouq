import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";
export const inputSchema = z.object({
  provider: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
  query: z.object({
    query: z.string().optional(),
    archive: z
      .any()
      .refine(
        (val) => {
          if (!val) {
            return true;
          }
          return typeof val === "string" && ["true", "false"].includes(val);
        },
        {
          message: "archive_wrong_value",
        }
      )
      .transform((val) => {
        if (!val) return false;
        return val === "true";
      }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
