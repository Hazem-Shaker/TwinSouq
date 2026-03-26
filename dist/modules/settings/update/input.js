"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
const validations_1 = require("../../../shared/utils/validations");
exports.inputSchema = zod_1.z.object({
    appName: zod_1.z.object({
        ar: zod_1.z
            .any()
            .refine((val) => val, {
            message: "app_name_ar_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "app_name_ar_wrong_type",
        }),
        en: zod_1.z
            .any()
            .refine((val) => val, {
            message: "app_name_en_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "app_name_en_wrong_type",
        }),
    }),
    appDescription: zod_1.z.object({
        ar: zod_1.z
            .any()
            .refine((val) => val, {
            message: "app_description_ar_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "app_description_ar_wrong_type",
        }),
        en: zod_1.z
            .any()
            .refine((val) => val, {
            message: "app_description_en_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "app_description_en_wrong_type",
        }),
    }),
    seo: zod_1.z.object({
        keywords: zod_1.z
            .any()
            .refine((val) => val, {
            message: "seo_description_missing",
        })
            .refine((val) => Array.isArray(val), {
            message: "keywords_wrong_type",
        })
            .refine((val) => {
            for (let v of val) {
                if (typeof v !== "string")
                    return false;
            }
            return true;
        }),
    }),
    location: zod_1.z.object({
        ar: zod_1.z
            .any()
            .refine((val) => val, {
            message: "location_ar_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "location_ar_wrong_type",
        }),
        en: zod_1.z
            .any()
            .refine((val) => val, {
            message: "location_en_missing",
        })
            .refine((val) => typeof val === "string", {
            message: "location_en_wrong_type",
        }),
    }),
    email: zod_1.z
        .any()
        .refine((val) => val, {
        message: "email_address_missing",
    })
        .refine((val) => typeof val === "string" && (0, validations_1.isValidEmail)(val), {
        message: "email_address_wrong_format",
    }),
    phone: zod_1.z
        .any()
        .refine((val) => val, {
        message: "phone_missing",
    })
        .refine((val) => typeof val === "string" && (0, validations_1.isValidPhone)(val), {
        message: "phone_wrong_format",
    }),
    copyRight: zod_1.z
        .any()
        .refine((val) => val, {
        message: "copyright_missing",
    })
        .refine((val) => typeof val === "string" && val.length > 3, {
        message: "copyright_format",
    }),
    socialMedia: zod_1.z.object({
        instagram: zod_1.z
            .any()
            .refine((val) => val, {
            message: "instagram_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "instagram_format",
        }),
        whatsapp: zod_1.z
            .any()
            .refine((val) => val, {
            message: "whatsapp_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "whatsapp_format",
        }),
        facebook: zod_1.z
            .any()
            .refine((val) => val, {
            message: "facebook_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "facebook_format",
        }),
        telegram: zod_1.z
            .any()
            .refine((val) => val, {
            message: "telegram_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "telegram_format",
        }),
        twitter: zod_1.z
            .any()
            .refine((val) => val, {
            message: "twitter_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "twitter_format",
        }),
        youtube: zod_1.z
            .any()
            .refine((val) => val, {
            message: "youtube_missing",
        })
            .refine((val) => typeof val === "string" && (0, validations_1.isValidURL)(val), {
            message: "youtube_format",
        }),
    }),
    headerLogo: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "header_logo_missing" }),
    footerLogo: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .length(1, { message: "footer_logo_missing" }),
});
