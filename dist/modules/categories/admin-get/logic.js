"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLogicForAdmin = void 0;
const input_1 = require("./input");
const category_model_1 = __importDefault(require("../category.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const aggregations_1 = require("../../../shared/utils/aggregations");
class GetLogicForAdmin {
    async getForAdmin(input) {
        const { id } = input_1.inputSchema.parse(input);
        const category = await category_model_1.default.aggregate([
            { $match: { _id: id } },
            ...(0, aggregations_1.imageAggregate)("image", true),
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name_ar: 1,
                    name_en: 1,
                    description_ar: 1,
                    description_en: 1,
                    parent: 1,
                    image: 1,
                    profitPercentage: 1,
                },
            },
        ]);
        if (category.length === 0) {
            throw new custom_errors_1.NotFoundError("category_not_found");
        }
        return category[0];
    }
}
exports.GetLogicForAdmin = GetLogicForAdmin;
