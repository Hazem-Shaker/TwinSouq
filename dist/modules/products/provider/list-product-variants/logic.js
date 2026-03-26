"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductVariantsLogic = void 0;
const input_1 = require("./input");
const variant_model_1 = __importDefault(require("../../product-variants/variant.model"));
const product_model_1 = __importDefault(require("../../product.model"));
const custom_errors_1 = require("../../../../shared/utils/custom-errors");
const variant_1 = require("../../../../shared/utils/aggregations/variant");
class ListProductVariantsLogic {
    async list(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { provider, pagination, product } = input;
        const productData = await product_model_1.default.findById(product);
        if (!productData) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        if (productData.provider.toString() !== provider.toString()) {
            throw new custom_errors_1.NotFoundError("product_not_found");
        }
        const variants = await variant_model_1.default.aggregate([
            { $match: { product: productData._id } },
            { $sort: { createdAt: -1 } },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            ...(0, variant_1.aggregateForProvider)(language),
        ]);
        const totalCount = await variant_model_1.default.countDocuments({
            product: productData._id,
        });
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: variants,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.ListProductVariantsLogic = ListProductVariantsLogic;
