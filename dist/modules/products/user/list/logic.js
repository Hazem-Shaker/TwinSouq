"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductsForUserLogic = void 0;
const query_parser_1 = require("./query-parser");
const input_1 = require("./input");
const product_model_1 = __importDefault(require("../../product.model"));
const product_1 = require("../../../../shared/utils/aggregations/product");
class ListProductsForUserLogic {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async list(input, language = "en") {
        const { pagination, query, user } = input_1.inputSchema.parse(input);
        const subCategories = await this.categoryService.getChildernIds(query.category ?? null);
        let sort = { createdAt: -1, views: -1, score: -1 };
        if (query.sort === "highest-price-first") {
            sort = { price: -1, views: -1, score: -1 };
        }
        if (query.sort === "lowest-price-first") {
            sort = { price: 1, views: -1, score: -1 };
        }
        if (query.sort === "latest-first") {
            sort = { createdAt: -1, views: -1, score: -1 };
        }
        if (query.sort === "oldest-first") {
            sort = { createdAt: 1, views: -1, score: -1 };
        }
        if (query.sort === "popular-first") {
            sort = { views: -1, createdAt: -1, score: -1 };
        }
        const favoriteAgg = [
            {
                $lookup: {
                    from: "favorites",
                    localField: "_id",
                    foreignField: "item",
                    as: "favorite",
                    pipeline: [
                        {
                            $match: {
                                user: user,
                            },
                        },
                    ],
                },
            },
            {
                $set: {
                    isFavorite: {
                        $cond: {
                            if: { $gt: [{ $size: "$favorite" }, 0] }, // Check if salePrice is not null
                            then: true,
                            else: false,
                        },
                    },
                },
            },
        ];
        const products = await product_model_1.default.aggregate([
            ...(0, query_parser_1.parseSearchQuery)(query, subCategories),
            {
                $addFields: { score: { $meta: "searchScore" } }, // Include the score in the result
            },
            { $sort: sort },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            ...(user
                ? favoriteAgg
                : [
                    {
                        $set: {
                            isFavorite: false,
                        },
                    },
                ]),
            ...(0, product_1.prodcutListForUser)(language),
        ]);
        const countQuery = await product_model_1.default.aggregate([
            ...(0, query_parser_1.parseSearchQuery)(query, subCategories),
            {
                $count: "totalResults", // ✅ Counts matching documents
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
exports.ListProductsForUserLogic = ListProductsForUserLogic;
