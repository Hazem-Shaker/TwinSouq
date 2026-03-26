"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogic = void 0;
const input_1 = require("./input");
const category_model_1 = __importDefault(require("../category.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const aggregations_1 = require("../../../shared/utils/aggregations");
class ListLogic {
    async list(pagination, query, language = "en") {
        pagination = input_1.paginationSchema.parse(pagination);
        query = input_1.querySchema.parse(query);
        const { parent, name } = query;
        const matchQuery = {
            isActive: true,
        };
        if (parent) {
            if (mongoose_1.default.Types.ObjectId.isValid(parent)) {
                matchQuery.parent = new mongoose_1.default.Types.ObjectId(parent);
            }
            else if (parent === "null") {
                matchQuery.parent = null;
            }
            else {
                const parentObj = await category_model_1.default.findOne({
                    $or: [
                        {
                            slug_ar: parent,
                        },
                        {
                            slug_en: parent,
                        },
                    ],
                });
                if (parentObj) {
                    matchQuery.parent = parentObj._id;
                }
            }
        }
        if (name && typeof name === "string") {
            console.log(name);
            matchQuery.$or = [
                {
                    name_ar: {
                        $regex: `${name}`,
                        $options: "i",
                    },
                },
                {
                    name_en: {
                        $regex: `${name}`,
                        $options: "i",
                    },
                },
            ];
        }
        const categories = await category_model_1.default.aggregate([
            { $match: { ...matchQuery } },
            { $skip: Number(pagination.skip) },
            { $limit: Number(pagination.limit) },
            ...(0, aggregations_1.categoryAggregation)(language),
        ]);
        // caluclate number of pages
        const totalCount = await category_model_1.default.countDocuments(matchQuery);
        const totalPages = Math.ceil(totalCount / pagination.limit);
        return {
            results: categories,
            totalCount,
            totalPages,
            currentPage: pagination.page,
        };
    }
}
exports.ListLogic = ListLogic;
