"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "provider_id_missing",
    }),
    name_ar: zod_1.z
        .any()
        .refine((val) => val, {
        message: "name_ar_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "name_ar_wrong_type",
    }),
    name_en: zod_1.z
        .any()
        .refine((val) => val, {
        message: "name_en_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "name_en_wrong_type",
    }),
    description_ar: zod_1.z
        .any()
        .refine((value) => value, {
        message: "arabic_description_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "arabic_description_wrong_type",
    }),
    description_en: zod_1.z
        .any()
        .refine((value) => value, {
        message: "english_description_missing",
    })
        .refine((val) => typeof val === "string", {
        message: "english_description_wrong_type",
    }),
    price: zod_1.z
        .any()
        .refine((value) => value, {
        message: "price_missing",
    })
        .refine((val) => !isNaN(Number(val)), {
        message: "price_wrong_type",
    })
        .transform((val) => Number(val)),
    category: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "category_id_missing",
    }),
    archive: zod_1.z
        .any()
        .refine((val) => typeof val === "string" && ["true", "false"].includes(val), {
        message: "archive_wrong_value",
    })
        .transform((val) => val === "true"),
    images: zod_1.z
        .array(zod_1.z.object({
        _id: custom_checckers_1.mongoIdSchema,
    }))
        .min(1, { message: "images_min_length_1" }) // Minimum length of 1
        .max(6, { message: "images_max_length_6" })
        .transform((value) => value.map((item) => item._id)), // Maximum length of 6
    notificationHours: zod_1.z
        .any()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "hours_must_be_positive",
    })
        .transform((val) => Number(val)),
    notificationDays: zod_1.z
        .any()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "days_must_be_positive",
    })
        .transform((val) => Number(val)),
    // options: z
    //   .any()
    //   .refine((value) => Array.isArray(value), {
    //     message: "options_must_be_array",
    //   })
    //   .refine(
    //     (val) =>
    //       val.every(
    //         (item) =>
    //           typeof item === "object" &&
    //           item !== null &&
    //           "key" in item &&
    //           typeof item.key === "string" &&
    //           "values" in item &&
    //           Array.isArray(item.values) &&
    //           item.values.every((value: any) => typeof value === "string")
    //       ),
    //     {
    //       message: "options_must_be_array_of_objects_with_key_and_values",
    //     }
    //   ),
    paymentChoices: zod_1.z
        .any()
        .refine((val) => val, {
        message: "payment_choice_missing",
    })
        .refine((val) => ["cash", "installements", "both"].includes(val), {
        message: "paymentChoices_invalid_value",
    }),
    salePrice: zod_1.z
        .any()
        .refine((val) => {
        if (typeof val === "number") {
            return true;
        }
        if (typeof val === "string" && val.length === 0) {
            return true;
        }
        return !isNaN(Number(val));
    }, {
        message: "price_wrong_type",
    })
        .transform((val) => {
        if (typeof val === "string" && val.length === 0) {
            return null;
        }
        return Number(val);
    })
        .optional(),
    installmentOptions: zod_1.z
        .any()
        .optional()
        .refine((value) => {
        if (!value)
            return true;
        return (Array.isArray(value) &&
            value.every((item) => {
                return (typeof item === "object" &&
                    item !== null &&
                    "period" in item &&
                    "profitPercantage" in item &&
                    "upfrontPercentage" in item &&
                    "contract" in item);
            }));
    }, {
        message: "installment_options_must_be_array_of_objects",
    })
        .transform((value) => {
        if (!value)
            return [];
        return value.map((item) => {
            return {
                period: Number(item.period),
                profitPercantage: Number(item.profitPercantage),
                upfrontPercentage: Number(item.upfrontPercentage),
                contract: item.contract[0]._id,
            };
        });
    }),
});
