import { z } from "zod";
import { mongoIdSchema } from "../../../../shared/utils/custom-checckers";

export const inputSchema = z.object({
  provider: mongoIdSchema.refine((value) => value, {
    message: "provider_id_missing",
  }),
  variantId: mongoIdSchema.refine((value) => value, {
    message: "variant_id_missing",
  }),
  data: z.object({
    price: z
      .any()
      .refine(
        (val) => {
          if (!val) return true;
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
        if (!val) return null;
        if (typeof val === "string" && val.length === 0) {
          return null;
        }
        return Number(val);
      })
      .optional(),
    images: z
      .array(
        z.object({
          _id: mongoIdSchema,
        })
      ) // Minimum length of 1
      .max(6, { message: "images_max_length_6" })
      .optional(), // Maximum length of 6
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
    ).optional(),
    salePrice: z
      .any()
      .refine(
        (val) => {
          if (!val) return true;
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
        if (!val) return null;
        if (typeof val === "string" && val.length === 0) {
          return null;
        }
        return Number(val);
      })
      .optional(),
  }),
});

export type Input = z.infer<typeof inputSchema>;
