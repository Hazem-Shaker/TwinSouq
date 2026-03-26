import { z } from "zod";
import mongoose from "mongoose";

export const inputSchema = z.object({
  user: z
    .any()
    .refine(
      (value) => {
        return (
          typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
        );
      },
      {
        message: "invalid_user_id",
      }
    )
    .transform((value) => {
      return new mongoose.Types.ObjectId(value as any as string);
    }),
  item: z
    .any()
    .refine(
      (value) => {
        return (
          typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
        );
      },
      {
        message: "invalid_item_id",
      }
    )
    .transform((value) => {
      return new mongoose.Types.ObjectId(value as any as string);
    }),
  comment: z.any().refine(
    (value) => {
      if (!value) return true;
      return typeof value === "string";
    },
    {
      message: "comment_wrong_type",
    }
  ),
  rating: z
    .any()
    .refine((value) => value, {
      message: "rating_missing",
    })
    .refine((val) => !isNaN(Number(val)) && Number.isInteger(Number(val)), {
      message: "rating_wrong_type",
    })
    .transform((val) => Number(val))
    .refine((value) => value >= 1 && value <= 5, {
      message: "rating_out_of_range",
    }),
  itemType: z
    .any()
    .refine((val) => val, {
      message: "item_type_missing",
    })
    .refine((val) => ["product"].includes(val), {
      message: "item_type_invalid_value",
    }),
});

export type Input = z.infer<typeof inputSchema>;
