"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductsForProviderLogic = void 0;
const input_1 = require("./input");
const product_model_1 = __importDefault(require("../../product.model"));
const product_1 = require("../../../../shared/utils/aggregations/product");
const query_parser_1 = require("./query-parser");
class ListProductsForProviderLogic {
    async list(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const { provider, pagination, query } = input;
        console.log(provider);
        const products = await product_model_1.default.aggregate([
            ...(0, query_parser_1.parseSearchQuery)(query, provider),
            { $sort: { createdAt: -1 } },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            ...(0, product_1.productListForProvider)(language),
        ]);
        const countQuery = await product_model_1.default.aggregate([
            ...(0, query_parser_1.parseSearchQuery)(query, provider),
            {
                $count: "totalResults",
            },
        ]);
        const totalCount = countQuery[0]?.totalResults ?? 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: products,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.ListProductsForProviderLogic = ListProductsForProviderLogic;
