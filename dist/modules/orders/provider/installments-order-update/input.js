"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema,
    id: (0, custom_checckers_1.mongoIdSchemaSpecialMessage)("invalid_order_id"),
    status: zod_1.z
        .any()
        .refine((value) => typeof value === "string" && ["approved", "rejected"].includes(value), {
        message: "invalid_status",
    }),
});
