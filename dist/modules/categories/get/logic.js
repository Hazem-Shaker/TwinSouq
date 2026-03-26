"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLogic = void 0;
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const aggregations_1 = require("../../../shared/utils/aggregations");
const mongoose_1 = __importDefault(require("mongoose"));
class GetLogic {
    async get(slug, language) {
        const query = {};
        // filters
        if (mongoose_1.default.Types.ObjectId.isValid(slug)) {
            query._id = new mongoose_1.default.Types.ObjectId(slug);
        }
        else {
            query.$or = [
                {
                    slug_ar: slug,
                },
                {
                    slug_en: slug,
                },
            ];
        }
        // query
        const categories = await category_model_1.default.aggregate([
            {
                $match: {
                    ...query,
                    isActive: true,
                },
            },
            ...(0, aggregations_1.categoryAggregation)(language),
        ]);
        if (!categories.length) {
            throw new custom_errors_1.NotFoundError("categoryNotFound"); // Use error key
        }
        return categories[0];
    }
}
exports.GetLogic = GetLogic;
