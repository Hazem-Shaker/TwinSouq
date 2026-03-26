"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const custom_checckers_1 = require("../../../../shared/utils/custom-checckers");
const mongoose_1 = __importDefault(require("mongoose"));
exports.inputSchema = zod_1.z.object({
    user: zod_1.z.any().transform((value) => {
        if (!value)
            return null;
        return new mongoose_1.default.Types.ObjectId(value);
    }),
    id: custom_checckers_1.mongoIdSchema.refine((value) => value, {
        message: "provider_id_missing",
    }),
    query: zod_1.z.object({
        variant: zod_1.z
            .any()
            .refine((value) => {
            if (!value) {
                return true;
            }
            return (typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value));
        }, {
            message: "invalid_variant_id",
        })
            .transform((value) => {
            if (!value)
                return value;
            return new mongoose_1.default.Types.ObjectId(value);
        }),
    }),
});
