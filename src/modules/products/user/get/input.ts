import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";
import mongoose from "mongoose";

export const inputSchema = z.object({
  user: z.any().transform((value) => {
    if (!value) return null;
    return new mongoose.Types.ObjectId(value);
  }),
  id: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  query: z.object({
    variant: z
      .any()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }
          return (
            typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
          );
        },
        {
          message: "invalid_variant_id",
        }
      )
      .transform((value) => {
        if (!value) return value;
        return new mongoose.Types.ObjectId(value as any as string);
      }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
