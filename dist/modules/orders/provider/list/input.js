"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    provider: custom_checckers_1.mongoIdSchema,
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
    query: zod_1.z.object({
        status: zod_1.z.any().refine((value) => {
            if (!value)
                return true;
            return (typeof value === "string" && ["pending", "completed"].includes(value));
        }),
    }),
});
