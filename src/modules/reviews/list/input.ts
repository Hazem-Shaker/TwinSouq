import { z } from "zod";
import mongoose from "mongoose";

export const inputSchema = z.object({
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
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
    details: z
      .any()
      .refine((value) => {
        if (!value) return true;
        return typeof value === "string" && ["true", "false"].includes(value);
      })
      .transform((value) => {
        if (!value) return false;
        return value === "true" ? true : false;
      }),
    sort: z.any().refine((value) => {
      if (!value) return true;
      return (
        typeof value === "string" &&
        ["highest", "lowest", "oldest", "newest"].includes(value)
      );
    }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
