// option.input.ts
import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const optionInputSchema = z.object({
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
  values: z
    .array(
      z.object({
        id: z
          .any()
          .refine((val) => val, {
            message: "value_id_missing",
          })
          .refine((val) => typeof val === "string", {
            message: "value_id_wrong_type",
          }),
        name_ar: z
          .any()
          .refine((val) => val, {
            message: "value_name_ar_missing",
          })
          .refine((val) => typeof val === "string", {
            message: "value_name_ar_wrong_type",
          }),
        name_en: z
          .any()
          .refine((val) => val, {
            message: "value_name_en_missing",
          })
          .refine((val) => typeof val === "string", {
            message: "value_name_en_wrong_type",
          }),
        metadata: z.record(z.any()).optional(), // Optional metadata
      })
    )
    .min(1, { message: "values_missing" }), // At least one value is required
  category: mongoIdSchema.refine((val) => val, {
    message: "category_id_missing",
  }),
});

export type OptionInput = z.infer<typeof optionInputSchema>;
