"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderStatsLogic = void 0;
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const provider_model_1 = __importDefault(require("../provider.model"));
class ProviderStatsLogic {
    async execute(input) {
        const { provider } = input_1.inputSchema.parse(input);
        const [providerStats] = await provider_model_1.default.aggregate([
            { $match: { _id: provider } },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "provider",
                    as: "products",
                },
            },
            {
                $project: {
                    views: 1,
                    rating: { $round: ["$rating", 2] },
                    productsCount: {
                        $size: {
                            $filter: {
                                input: "$products",
                                as: "product",
                                cond: { $eq: ["$$product.archive", false] },
                            },
                        },
                    },
                    archivedProductsCount: {
                        $size: {
                            $filter: {
                                input: "$products",
                                as: "product",
                                cond: { $eq: ["$$product.archive", true] },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);
        if (!providerStats) {
            throw new custom_errors_1.NotFoundError("Provider not found");
        }
        return providerStats;
    }
}
exports.ProviderStatsLogic = ProviderStatsLogic;
