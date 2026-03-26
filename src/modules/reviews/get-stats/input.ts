import { z } from "zod";
import mongoose from "mongoose";

export const inputSchema = z.object({
  query: z.object({
    item: z
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
          message: "invalid_item_id",
        }
      )
      .transform((value) => {
        if (!value) return value;
        return new mongoose.Types.ObjectId(value as any as string);
      }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
