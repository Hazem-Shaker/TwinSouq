"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.inputSchema = zod_1.z.object({
    user: zod_1.z
        .any()
        .refine((value) => {
        return (typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value));
    }, {
        message: "invalid_user_id",
    })
        .transform((value) => {
        return new mongoose_1.default.Types.ObjectId(value);
    }),
    item: zod_1.z
        .any()
        .refine((value) => {
        return (typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value));
    }, {
        message: "invalid_item_id",
    })
        .transform((value) => {
        return new mongoose_1.default.Types.ObjectId(value);
    }),
    comment: zod_1.z.any().refine((value) => {
        if (!value)
            return true;
        return typeof value === "string";
    }, {
        message: "comment_wrong_type",
    }),
    rating: zod_1.z
        .any()
        .refine((value) => value, {
        message: "rating_missing",
    })
        .refine((val) => !isNaN(Number(val)) && Number.isInteger(Number(val)), {
        message: "rating_wrong_type",
    })
        .transform((val) => Number(val))
        .refine((value) => value >= 1 && value <= 5, {
        message: "rating_out_of_range",
    }),
    itemType: zod_1.z
        .any()
        .refine((val) => val, {
        message: "item_type_missing",
    })
        .refine((val) => ["product"].includes(val), {
        message: "item_type_invalid_value",
    }),
});
