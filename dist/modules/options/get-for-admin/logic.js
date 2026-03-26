"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetForAdminLogic = void 0;
const option_model_1 = require("../option.model");
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class GetForAdminLogic {
    async list(input, language = "en") {
        // Validate and parse the input
        input = input_1.inputSchema.parse(input);
        const { id } = input;
        const options = await option_model_1.Option.aggregate([
            { $match: { _id: id } },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name_en: 1, // Use the appropriate language field
                    name_ar: 1, // Use the appropriate language field
                    values: {
                        $map: {
                            input: "$values",
                            as: "value",
                            in: {
                                id: "$$value.id",
                                name_en: "$$value.name_en",
                                name_ar: "$$value.name_ar",
                            },
                        },
                    },
                },
            },
        ]);
        if (!options.length) {
            throw new custom_errors_1.NotFoundError("option_not_found");
        }
        return options[0];
    }
}
exports.GetForAdminLogic = GetForAdminLogic;
