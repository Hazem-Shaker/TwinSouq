"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListByCategoryIdLogic = void 0;
const option_model_1 = require("../option.model");
const input_1 = require("./input");
const aggregations_1 = require("../../../shared/utils/aggregations");
class ListByCategoryIdLogic {
    async list(input, language = "en", forAdmin = false) {
        // Validate and parse the input
        input = input_1.inputSchema.parse(input);
        const { categoryId } = input;
        // Define the language-specific field name
        // Use aggregation to fetch and transform the data
        const options = await option_model_1.Option.aggregate([
            // Match options by category ID
            { $match: { category: categoryId } },
            // Project the required fields with localized names
            ...(0, aggregations_1.optionsAggregation)(language, forAdmin),
        ]);
        return options;
    }
}
exports.ListByCategoryIdLogic = ListByCategoryIdLogic;
