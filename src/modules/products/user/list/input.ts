import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";
import mongoose from "mongoose";

export const inputSchema = z.object({
  user: z.any().transform((value) => {
    if (!value) return null;
    return new mongoose.Types.ObjectId(value);
  }),
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
  query: z.object({
    query: z.string().optional(),
    sort: z.string().optional(),
    rating: z
      .any()
      .refine(
        (value) => {
          if (!value) return true;
          return typeof value === "string" && !isNaN(Number(value));
        },
        {
          message: "rating_wrong_type",
        }
      )
      .transform((value) => {
        if (!value) return 0;
        return Number(value);
      }),
    minPrice: z
      .any()
      .refine(
        (value) => {
          if (!value) return true;
          return typeof value === "string" && !isNaN(Number(value));
        },
        {
          message: "min_price_wrong_type",
        }
      )
      .transform((value) => {
        if (value === null || value === undefined || value === "") return null;
        return Number(value);
      }),
    maxPrice: z
      .any()
      .refine(
        (value) => {
          if (!value) return true;
          return typeof value === "string" && !isNaN(Number(value));
        },
        {
          message: "max_price_wrong_type",
        }
      )
      .transform((value) => {
        if (value === null || value === undefined || value === "") return null;
        return Number(value);
      }),
    category: z
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
          message: "invalid_category_id",
        }
      )
      .transform((value) => {
        if (!value) return value;
        return new mongoose.Types.ObjectId(value as any as string);
      }),
    sale: z.any().refine(
      (value) => {
        if (!value) return true;
        if (typeof value !== "string") return false;
        if (!["true", "false"].includes(value)) return false;
        return true;
      },
      { message: "sale_field_wrong_value" }
    ),
    installments: z.any().refine(
      (value) => {
        if (!value) return true;
        if (typeof value !== "string") return false;
        if (!["true", "false"].includes(value)) return false;
        return true;
      },
      { message: "installment_field_wrong_value" }
    ),
  }),
});

export type Input = z.infer<typeof inputSchema>;
