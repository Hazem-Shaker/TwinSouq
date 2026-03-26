"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.inputSchema = zod_1.z.object({
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
    query: zod_1.z.object({
        item: zod_1.z
            .any()
            .refine((value) => {
            if (!value) {
                return true;
            }
            return (typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value));
        }, {
            message: "invalid_item_id",
        })
            .transform((value) => {
            if (!value)
                return value;
            return new mongoose_1.default.Types.ObjectId(value);
        }),
        details: zod_1.z
            .any()
            .refine((value) => {
            if (!value)
                return true;
            return typeof value === "string" && ["true", "false"].includes(value);
        })
            .transform((value) => {
            if (!value)
                return false;
            return value === "true" ? true : false;
        }),
        sort: zod_1.z.any().refine((value) => {
            if (!value)
                return true;
            return (typeof value === "string" &&
                ["highest", "lowest", "oldest", "newest"].includes(value));
        }),
    }),
});
