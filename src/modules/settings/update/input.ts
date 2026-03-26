import { z } from "zod";
import { mongoIdSchema } from "../../../shared/utils/custom-checckers";
import {
  isValidEmail,
  isValidPhone,
  isValidURL,
} from "../../../shared/utils/validations";

export const inputSchema = z.object({
  appName: z.object({
    ar: z
      .any()
      .refine((val) => val, {
        message: "app_name_ar_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "app_name_ar_wrong_type",
      }),
    en: z
      .any()
      .refine((val) => val, {
        message: "app_name_en_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "app_name_en_wrong_type",
      }),
  }),
  appDescription: z.object({
    ar: z
      .any()
      .refine((val) => val, {
        message: "app_description_ar_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "app_description_ar_wrong_type",
      }),
    en: z
      .any()
      .refine((val) => val, {
        message: "app_description_en_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "app_description_en_wrong_type",
      }),
  }),
  seo: z.object({
    keywords: z
      .any()
      .refine((val) => val, {
        message: "seo_description_missing",
      })
      .refine((val) => Array.isArray(val), {
        message: "keywords_wrong_type",
      })
      .refine((val) => {
        for (let v of val) {
          if (typeof v !== "string") return false;
        }
        return true;
      }),
  }),
  location: z.object({
    ar: z
      .any()
      .refine((val) => val, {
        message: "location_ar_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "location_ar_wrong_type",
      }),
    en: z
      .any()
      .refine((val) => val, {
        message: "location_en_missing",
      })
      .refine((val) => typeof val === "string", {
        message: "location_en_wrong_type",
      }),
  }),
  email: z
    .any()
    .refine((val) => val, {
      message: "email_address_missing",
    })
    .refine((val) => typeof val === "string" && isValidEmail(val), {
      message: "email_address_wrong_format",
    }),
  phone: z
    .any()
    .refine((val) => val, {
      message: "phone_missing",
    })
    .refine((val) => typeof val === "string" && isValidPhone(val), {
      message: "phone_wrong_format",
    }),
  copyRight: z
    .any()
    .refine((val) => val, {
      message: "copyright_missing",
    })
    .refine((val) => typeof val === "string" && val.length > 3, {
      message: "copyright_format",
    }),
  socialMedia: z.object({
    instagram: z
      .any()
      .refine((val) => val, {
        message: "instagram_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "instagram_format",
      }),
    whatsapp: z
      .any()
      .refine((val) => val, {
        message: "whatsapp_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "whatsapp_format",
      }),
    facebook: z
      .any()
      .refine((val) => val, {
        message: "facebook_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "facebook_format",
      }),
    telegram: z
      .any()
      .refine((val) => val, {
        message: "telegram_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "telegram_format",
      }),
    twitter: z
      .any()
      .refine((val) => val, {
        message: "twitter_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "twitter_format",
      }),
    youtube: z
      .any()
      .refine((val) => val, {
        message: "youtube_missing",
      })
      .refine((val) => typeof val === "string" && isValidURL(val), {
        message: "youtube_format",
      }),
  }),
  headerLogo: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "header_logo_missing" }),
  footerLogo: z
    .array(
      z.object({
        _id: mongoIdSchema,
      })
    )
    .length(1, { message: "footer_logo_missing" }),
});

export type Input = z.infer<typeof inputSchema>;
