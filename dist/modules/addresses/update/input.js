"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    id: custom_checckers_1.mongoIdSchema,
    data: zod_1.z.object({
        title: (0, custom_checckers_1.stringSchema)("title"),
        owner: custom_checckers_1.mongoIdSchema,
        name: (0, custom_checckers_1.stringSchema)("name"),
        country: (0, custom_checckers_1.stringSchema)("country"),
        city: (0, custom_checckers_1.stringSchema)("city"),
        streetAddress: (0, custom_checckers_1.stringSchema)("streetAddress"),
        zipCode: (0, custom_checckers_1.stringSchema)("zipCode"),
    }),
});
