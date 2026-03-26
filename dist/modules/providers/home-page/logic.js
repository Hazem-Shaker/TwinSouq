"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderHomePageLogic = void 0;
const provider_model_1 = __importDefault(require("../provider.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class ProviderHomePageLogic {
    async execute(input) {
        input = input_1.inputSchema.parse(input);
        const [provider] = await provider_model_1.default.aggregate([
            {
                $match: {
                    _id: input.provider,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                    from: "providerBalances",
                    localField: "_id",
                    foreignField: "provider",
                    as: "balance",
                },
            },
            {
                $unwind: { path: "$balance", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 0,
                    name: "$user.name",
                    earnings: {
                        $cond: {
                            if: { $ne: ["$balance", null] },
                            then: {
                                $sum: ["$balance.availableBalance", "$balance.totalWithdrawn"],
                            },
                            else: 0,
                        },
                    },
                    visits: "$views",
                },
            },
        ]);
        if (!provider)
            throw new custom_errors_1.NoRouteFound("provider_not_found");
        return provider;
    }
}
exports.ProviderHomePageLogic = ProviderHomePageLogic;
