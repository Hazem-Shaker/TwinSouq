"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../shared/utils/custom-checckers");
exports.inputSchema = zod_1.z.object({
    user: custom_checckers_1.mongoIdSchema,
    data: zod_1.z.object({
        name: zod_1.z.string().refine((val) => {
            if (val === undefined)
                return true;
            return val.length >= 2;
        }, {
            message: "invalid_name",
        }),
        phone: zod_1.z.string().refine((val) => {
            if (val === undefined)
                return true;
            return true;
        }, {
            message: "invalid_phone",
        }),
        address: zod_1.z
            .string()
            .optional()
            .refine((val) => {
            if (val === undefined)
                return true;
            return val.length >= 5;
        }, {
            message: "invalid_address",
        }),
        photo: zod_1.z
            .array(zod_1.z.object({
            _id: custom_checckers_1.mongoIdSchema,
        }))
            .length(1, { message: "image_missing" }),
    }),
});
