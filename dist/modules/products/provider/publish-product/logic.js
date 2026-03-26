"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishProductLogic = void 0;
const product_model_1 = __importDefault(require("../../product.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
class PublishProductLogic {
    async execute(input) {
        input = input_1.inputSchema.parse(input);
        const { id, provider } = input;
        const product = await product_model_1.default.findById(id);
        if (!product)
            throw new custom_errors_1.NotFoundError("product_not_found");
        if (product.provider.toString() !== provider.toString()) {
            throw new custom_errors_1.InvalidCredentialsError("product_not_found");
        }
        product.archive = false;
        await product.save();
        return null;
    }
}
exports.PublishProductLogic = PublishProductLogic;
