"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListReviewsLogic = void 0;
const review_model_1 = __importDefault(require("../review.model"));
const input_1 = require("./input");
const query_parser_1 = require("./query-parser");
class ListReviewsLogic {
    constructor() { }
    async list(input, language = "en") {
        const { pagination, query } = input_1.inputSchema.parse(input);
        const { sort } = query;
        let sortObj = {};
        switch (sort) {
            case "highest":
                sortObj = { rating: -1 };
                break;
            case "lowest":
                sortObj = { rating: 1 };
                break;
            case "oldest":
                sortObj = { createdAt: 1 };
                break;
            default:
                sortObj = { createdAt: -1 };
                break;
        }
        const reviews = await review_model_1.default.aggregate([
            ...(0, query_parser_1.parseSearchQuery)(query),
            { $sort: sortObj },
            { $skip: pagination.skip },
            { $limit: pagination.limit },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                _id: 0,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            {
                $set: {
                    user: "$user.name",
                },
            },
            {
                $project: {
                    id: "$_id",
                    user: 1,
                    rating: 1,
                    comment: 1,
                    date: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
                    _id: 0,
                },
            },
        ]);
        const totalCount = await review_model_1.default.countDocuments(query.item
            ? {
                item: query.item,
            }
            : {});
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: reviews,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.ListReviewsLogic = ListReviewsLogic;
