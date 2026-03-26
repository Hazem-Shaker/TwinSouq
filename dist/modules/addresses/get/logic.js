"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLogic = void 0;
const input_1 = require("./input");
const adress_model_1 = __importDefault(require("../adress.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class GetLogic {
    constructor() { }
    async get(input, language = "en") {
        const { owner, id } = input_1.inputSchema.parse(input);
        const address = await adress_model_1.default.findOne({ _id: id, owner });
        if (!address) {
            throw new custom_errors_1.NotFoundError("address_not_found");
        }
        return address;
    }
}
exports.GetLogic = GetLogic;
