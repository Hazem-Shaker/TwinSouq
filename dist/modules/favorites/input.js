"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInputSchema = exports.addInputSchema = void 0;
const custom_checckers_1 = require("../../shared/utils/custom-checckers");
const zod_1 = require("zod");
exports.addInputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    item: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("item_id_wrong_format"),
    itemType: zod_1.z
        .any()
        .refine((value) => value, {
        message: "itemType_missing",
    })
        .refine((value) => typeof value === "string" && value === "product", {
        message: "itemType_wrong_value",
    }),
});
exports.listInputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
});
