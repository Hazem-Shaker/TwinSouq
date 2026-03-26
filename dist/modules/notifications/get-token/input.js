"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.getTokenInputSchema = zod_1.z.object({
    userId: custom_checckers_1.mongoIdSchema,
    type: zod_1.z.enum(["provider", "customer"]),
});
