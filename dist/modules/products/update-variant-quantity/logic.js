"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVariantQuantityLogic = void 0;
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const variant_model_1 = __importDefault(require("../product-variants/variant.model"));
class UpdateVariantQuantityLogic {
    constructor() { }
    async decrease(input, session) {
        input = input_1.inputSchema.parse(input);
        for (let item of input) {
            const variant = await variant_model_1.default.findById(item.variant);
            if (!variant) {
                throw new custom_errors_1.NotFoundError("varaint_not_found");
            }
            if (item.quantity > variant.stock) {
                throw new custom_errors_1.ConflictError("out_of_stock");
            }
            variant.stock -= item.quantity;
            await variant.save({ session });
        }
        return true;
    }
    async rollback(input) {
        input = input_1.inputSchema.parse(input);
        for (let item of input) {
            const variant = await variant_model_1.default.findById(item.variant);
            if (!variant) {
                throw new custom_errors_1.NotFoundError("varaint_not_found");
            }
            variant.stock += item.quantity;
            await variant.save();
        }
        return true;
    }
}
exports.UpdateVariantQuantityLogic = UpdateVariantQuantityLogic;
