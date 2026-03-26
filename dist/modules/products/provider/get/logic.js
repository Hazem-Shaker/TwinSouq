"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductDetailForProviderLogic = void 0;
const input_1 = require("./input");
const product_model_1 = __importDefault(require("../../product.model"));
const product_1 = require("../../../../shared/utils/aggregations/product");
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
class GetProductDetailForProviderLogic {
    constructor() { }
    async get(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { provider, product } = input;
        console.log(provider);
        const productDetails = await product_model_1.default.aggregate([
            {
                $match: {
                    _id: product,
                    provider: provider,
                },
            },
            ...(0, product_1.productDetailsForProvider)(language),
        ]);
        if (!productDetails.length)
            throw new custom_errors_1.NotFoundError("product_not_found");
        return productDetails[0];
    }
}
exports.GetProductDetailForProviderLogic = GetProductDetailForProviderLogic;
