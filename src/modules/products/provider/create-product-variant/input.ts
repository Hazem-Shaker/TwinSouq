import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  product: mongoIdSchema,
  price: z
    .any()
    .refine((value) => value, {
      message: "price_missing",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "price_wrong_type",
    })
    .transform((val) => Number(val))
    .optional(),
  images: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    ) // Minimum length of 1
    .max(6, { message: "images_max_length_6" })
    .optional(), // Maximum length of 6
  options: z
    .any()
    .refine((value) => Array.isArray(value), {
      message: "options_must_be_array",
    })
    .refine(
      (val) =>
        val.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "key" in item &&
            typeof item.key === "string" &&
            "value" in item &&
            typeof item.value === "string"
        ),
      {
        message: "options_must_be_array_of_objects_with_key_and_values",
      }
    ),
  stock: z
    .any()
    .refine((value) => value, {
      message: "stock_missing",
    })
    .refine(
      (val) => {
        if (typeof val === "number") {
          return val >= 0;
        }
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "stock_must_be_positive_or_zero",
      }
    ),
  salePrice: z
    .any()
    .refine(
      (val) => {
        if (typeof val === "number") {
          return true;
        }

        if (typeof val === "string" && val.length === 0) {
          return true;
        }

        return !isNaN(Number(val));
      },
      {
        message: "price_wrong_type",
      }
    )
    .transform((val) => {
      if (typeof val === "string" && val.length === 0) {
        return null;
      }
      return Number(val);
    })
    .optional(),
});

export type Input = z.infer<typeof inputSchema>;
