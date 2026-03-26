"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    limit: zod_1.z.number(),
    skip: zod_1.z.number(),
    page: zod_1.z.number(),
});
exports.querySchema = zod_1.z.object({
    parent: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
});
