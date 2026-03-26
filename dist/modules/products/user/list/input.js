"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.inputSchema = zod_1.z.object({
    user: zod_1.z.any().transform((value) => {
        if (!value)
            return null;
        return new mongoose_1.default.Types.ObjectId(value);
    }),
    pagination: zod_1.z.object({
        limit: zod_1.z.number(),
        skip: zod_1.z.number(),
        page: zod_1.z.number(),
    }),
    query: zod_1.z.object({
        query: zod_1.z.string().optional(),
        sort: zod_1.z.string().optional(),
        rating: zod_1.z
            .any()
            .refine((value) => {
            if (!value)
                return true;
            return typeof value === "string" && !isNaN(Number(value));
        }, {
            message: "rating_wrong_type",
        })
            .transform((value) => {
            if (!value)
                return 0;
            return Number(value);
        }),
        minPrice: zod_1.z
            .any()
            .refine((value) => {
            if (!value)
                return true;
            return typeof value === "string" && !isNaN(Number(value));
        }, {
            message: "min_price_wrong_type",
        })
            .transform((value) => {
            if (value === null || value === undefined || value === "")
                return null;
            return Number(value);
        }),
        maxPrice: zod_1.z
            .any()
            .refine((value) => {
            if (!value)
                return true;
            return typeof value === "string" && !isNaN(Number(value));
        }, {
            message: "max_price_wrong_type",
        })
            .transform((value) => {
            if (value === null || value === undefined || value === "")
                return null;
            return Number(value);
        }),
        category: zod_1.z
            .any()
            .refine((value) => {
            if (!value) {
                return true;
            }
            return (typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value));
        }, {
            message: "invalid_category_id",
        })
            .transform((value) => {
            if (!value)
                return value;
            return new mongoose_1.default.Types.ObjectId(value);
        }),
        sale: zod_1.z.any().refine((value) => {
            if (!value)
                return true;
            if (typeof value !== "string")
                return false;
            if (!["true", "false"].includes(value))
                return false;
            return true;
        }, { message: "sale_field_wrong_value" }),
        installments: zod_1.z.any().refine((value) => {
            if (!value)
                return true;
            if (typeof value !== "string")
                return false;
            if (!["true", "false"].includes(value))
                return false;
            return true;
        }, { message: "installment_field_wrong_value" }),
    }),
});
