"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.array(zod_1.z.object({
    variant: custom_checckers_1.mongoIdSchema,
    quantity: zod_1.z.number(),
}));
