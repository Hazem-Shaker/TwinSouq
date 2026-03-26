"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
exports.inputSchema = zod_1.z.object({
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
    query: zod_1.z.object({
        paymentStatus: zod_1.z.any().refine((value) => {
            if (!value)
                return true;
            return typeof value === "string" && ["paid", "failed"].includes(value);
        }),
        shippingStatus: zod_1.z.any().refine(value => {
            if (!value)
                return true;
            return typeof value === "string" && [""];
        })
    }),
});
