import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";
export const inputSchema = z.object({
  user: mongoIdSchema,
  data: z.object({
    name: z.string().refine(
      (val) => {
        if (val === undefined) return true;
        return val.length >= 2;
      },
      {
        message: "invalid_name",
      }
    ),
    phone: z.string().refine(
      (val) => {
        if (val === undefined) return true;
        return true;
      },
      {
        message: "invalid_phone",
      }
    ),
    address: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (val === undefined) return true;
          return val.length >= 5;
        },
        {
          message: "invalid_address",
        }
      ),
    photo: z
      .array(
        z.object({
          _id: mongoIdSchema,
        })
      )
      .length(1, { message: "image_missing" }),
  }),
});

export type Input = z.infer<typeof inputSchema>;
