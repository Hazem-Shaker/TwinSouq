import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  name_ar: z
    .any()
    .refine((val) => val, {
      message: "name_ar_missing",
    })
    .refine((val) => typeof val === "string", {
      message: "name_ar_wrong_type",
    }),
  name_en: z
    .any()
    .refine((val) => val, {
      message: "name_en_missing",
    })
    .refine((val) => typeof val === "string", {
      message: "name_en_wrong_type",
    }),
  description_ar: z
    .string()
    .nullable()
    .or(z.null())
    .refine((val) => typeof val === "string", {
      message: "description_ar_wrong_type",
    })
    .optional(),
  description_en: z
    .string()
    .nullable()
    .or(z.null())
    .refine((val) => typeof val === "string", {
      message: "description_en_wrong_type",
    })
    .optional(),
  parent: mongoIdSchema.optional(),
  profitPercentage: z
    .preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z
        .number({ invalid_type_error: "profit_percentage_wrong_type" })
        .min(0, { message: "profit_percentage_min" })
        .max(100, { message: "profit_percentage_max" })
    )
    .optional(),
  image: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "image_missing" }), // Restrict array length to 1
});

export type Input = z.infer<typeof inputSchema>;
