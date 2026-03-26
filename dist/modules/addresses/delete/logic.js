"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLogic = void 0;
const adress_model_1 = __importDefault(require("../adress.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class DeleteLogic {
    constructor() { }
    async remove(input, language = "en") {
        const { id, owner } = input_1.inputSchema.parse(input);
        const address = adress_model_1.default.findOne({
            _id: id,
            owner,
        });
        if (!address) {
            throw new custom_errors_1.NotFoundError("address_not_found");
        }
        await adress_model_1.default.findByIdAndDelete(id);
        return null;
    }
}
exports.DeleteLogic = DeleteLogic;
