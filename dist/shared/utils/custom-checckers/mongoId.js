"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoIdSchemaSpecialMessage = exports.mongoIdSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Custom MongoId checker
exports.mongoIdSchema = zod_1.z.union([
    zod_1.z
        .string()
        .refine((id) => /^[a-f\d]{24}$/i.test(id), {
        message: "invalid_mongo_id",
    })
        .transform((id) => new mongoose_1.default.Types.ObjectId(id)),
    zod_1.z
        .any()
        .refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "invalid_mongo_id",
    })
        .transform((id) => new mongoose_1.default.Types.ObjectId(id.toString())),
]);
const mongoIdSchemaSpecialMessage = (message) => zod_1.z.union([
    zod_1.z
        .string()
        .refine((id) => /^[a-f\d]{24}$/i.test(id), {
        message,
    })
        .transform((id) => new mongoose_1.default.Types.ObjectId(id)),
    zod_1.z
        .any()
        .refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message,
    })
        .transform((id) => new mongoose_1.default.Types.ObjectId(id.toString())),
]);
exports.mongoIdSchemaSpecialMessage = mongoIdSchemaSpecialMessage;
