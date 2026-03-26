"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const input_1 = require("./input");
const favorite_model_1 = __importDefault(require("./favorite.model"));
const custom_errors_1 = require("../../shared/utils/custom-errors");
const product_1 = require("../../shared/utils/aggregations/product");
class FavoriteService {
    constructor() { }
    async add(input) {
        input = input_1.addInputSchema.parse(input);
        const exisingFavorite = await favorite_model_1.default.findOne({
            user: input.user,
            item: input.item,
        });
        if (exisingFavorite) {
            throw new custom_errors_1.ConflictError("item_already_in_favorites");
        }
        const favorite = await favorite_model_1.default.create(input);
        return favorite;
    }
    async remove(input) {
        input = input_1.addInputSchema.parse(input);
        const exisingFavorite = await favorite_model_1.default.findOne({
            user: input.user,
            item: input.item,
        });
        if (!exisingFavorite) {
            throw new custom_errors_1.NotFoundError("item_not_found");
        }
        await favorite_model_1.default.findByIdAndDelete(exisingFavorite._id);
        return null;
    }
    async listFavorites(input, language = "en") {
        const { user, pagination } = input_1.listInputSchema.parse(input);
        const favorites = await favorite_model_1.default.aggregate([
            {
                $match: {
                    user: user,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
                $lookup: {
                    from: "products",
                    localField: "item",
                    foreignField: "_id",
                    as: "product",
                    pipeline: [
                        { $set: { isFavorite: true } },
                        ...(0, product_1.prodcutListForUser)(language),
                    ],
                },
            },
            {
                $set: {
                    item: { $arrayElemAt: ["$product", 0] },
                },
            },
            { $project: { item: 1, _id: 0 } },
        ]);
        const totalCount = await favorite_model_1.default.countDocuments({ user });
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: favorites,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.FavoriteService = FavoriteService;
