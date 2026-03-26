import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";

export const sendNotificationInputSchema = z.object({
  type: z.enum(["from-admin", "order-update"]),
  target: z
    .any()
    .refine((value) => {
      if (typeof value !== "string") return false;
      return (
        ["all-customers", "all-vendors", "all-users"].includes(value) ||
        mongoIdSchema.safeParse(value).success
      );
    })
    .transform((value) => {
      if (mongoIdSchema.safeParse(value).success)
        return { type: "user", id: mongoIdSchema.parse(value) };
      let id: string;
      switch (value) {
        case "all-customers":
          id = "customer";
          break;
        case "all-vendors":
          id = "vendor";
          break;
        case "all-users":
          id = "user";
          break;
        default:
          id = value;
          break;
      }
      return { type: "interest", id: id };
    }),
  app: z.enum(["customer", "provider", "both"]),
  title_ar: z.string({ message: "title_ar_missing" }),
  title_en: z.string({ message: "title_en_missing" }),
  body_ar: z.string({ message: "body_ar_missing" }),
  body_en: z.string({ message: "body_en_missing" }),
  data: z.record(z.any()).optional(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationInputSchema>;
