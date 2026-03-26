"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogic = void 0;
const adress_model_1 = __importDefault(require("../adress.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class UpdateLogic {
    constructor() { }
    async update(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const existingTitle = await adress_model_1.default.findOne({
            id: { $ne: input.id },
            owner: input.data.owner,
            title: input.data.title,
        });
        if (existingTitle &&
            existingTitle.owner.toString() !== input.data.owner.toString()) {
            throw new custom_errors_1.ConflictError("title_of_the_address_exits");
        }
        const address = await adress_model_1.default.findByIdAndUpdate(input.id, { ...input }, { new: true });
        return address;
    }
}
exports.UpdateLogic = UpdateLogic;
