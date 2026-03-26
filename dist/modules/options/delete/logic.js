"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteForAdminLogic = void 0;
const option_model_1 = require("../option.model");
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class DeleteForAdminLogic {
    async delete(input, language = "en") {
        // Validate and parse the input
        input = input_1.inputSchema.parse(input);
        console.log("Deleting option with input:", input);
        const { id } = input_1.inputSchema.parse(input);
        const optionExists = await option_model_1.Option.findByIdAndDelete(id);
        if (!optionExists) {
            throw new custom_errors_1.NotFoundError("option_not_found");
        }
        return true;
    }
}
exports.DeleteForAdminLogic = DeleteForAdminLogic;
