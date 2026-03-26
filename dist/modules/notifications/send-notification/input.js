"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationInputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.sendNotificationInputSchema = zod_1.z.object({
    type: zod_1.z.enum(["from-admin", "order-update"]),
    target: zod_1.z
        .any()
        .refine((value) => {
        if (typeof value !== "string")
            return false;
        return (["all-customers", "all-vendors", "all-users"].includes(value) ||
            custom_checckers_1.mongoIdSchema.safeParse(value).success);
    })
        .transform((value) => {
        if (custom_checckers_1.mongoIdSchema.safeParse(value).success)
            return { type: "user", id: custom_checckers_1.mongoIdSchema.parse(value) };
        let id;
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
    app: zod_1.z.enum(["customer", "provider", "both"]),
    title_ar: zod_1.z.string({ message: "title_ar_missing" }),
    title_en: zod_1.z.string({ message: "title_en_missing" }),
    body_ar: zod_1.z.string({ message: "body_ar_missing" }),
    body_en: zod_1.z.string({ message: "body_en_missing" }),
    data: zod_1.z.record(zod_1.z.any()).optional(),
});
