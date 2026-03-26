import {
  mongoIdSchemaSpecialMessage,
  mongoIdSchema,
} from "../../shared/utils/custom-checckers";
import { z } from "zod";

export const addInputSchema = z.object({
  user: mongoIdSchema,
  item: mongoIdSchemaSpecialMessage("item_id_wrong_format"),
  itemType: z
    .any()
    .refine((value) => value, {
      message: "itemType_missing",
    })
    .refine(
      (value) => typeof value === "string" && value === "product",
      {
        message: "itemType_wrong_value",
      }
    ),
});

export type AddInput = z.infer<typeof addInputSchema>;

export const listInputSchema = z.object({
  user: mongoIdSchema,
  pagination: z.object({
    limit: z.number(),
    skip: z.number(),
    page: z.number(),
  }),
});

export type ListInput = z.infer<typeof listInputSchema>;
