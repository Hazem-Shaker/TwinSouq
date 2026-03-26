"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogicForAdmin = void 0;
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class ListLogicForAdmin {
    async listForAdmin(requestQuery, filter) {
        let filterParam = filter?.trim() || 'all';
        if (filterParam !== 'active' && filterParam !== 'inActive' && filterParam !== 'all') {
            throw new custom_errors_1.NotFoundError("Invalid filter");
        }
        let matchStage;
        if (filterParam === 'active') {
            matchStage = { isActive: true };
        }
        else if (filterParam === 'inActive') {
            matchStage = { isActive: false };
        }
        else {
            matchStage = {};
        }
        const categories = await category_model_1.default.aggregate([
            { $match: matchStage },
            { $skip: Number(requestQuery.skip) },
            { $limit: Number(requestQuery.limit) },
            {
                $lookup: {
                    from: "files",
                    localField: "image",
                    foreignField: "_id",
                    as: "image",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent",
                },
            },
            {
                $unwind: {
                    path: "$image",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$parent",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "files",
                    localField: "parent.image",
                    foreignField: "_id",
                    as: "parent.image",
                },
            },
            {
                $unwind: {
                    path: "$parent.image",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    slug: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "image._id": 1,
                    "image.path": 1,
                    parent: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        'image._id': 1,
                        'image.path': 1,
                        slug: 1,
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            },
        ]);
        if (!categories) {
            throw new custom_errors_1.NotFoundError("Category not found");
        }
        return categories;
    }
}
exports.ListLogicForAdmin = ListLogicForAdmin;
