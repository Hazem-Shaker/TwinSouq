"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogic = void 0;
const adress_model_1 = __importDefault(require("../adress.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class CreateLogic {
    constructor() { }
    async create(input, language = "en") {
        input = input_1.inputSchema.parse(input);
        const existingTitle = await adress_model_1.default.findOne({
            owner: input.owner,
            title: input.title,
        });
        if (existingTitle) {
            throw new custom_errors_1.ConflictError("title_of_the_address_exits");
        }
        const numberOfAddresses = await adress_model_1.default.countDocuments({
            owner: input.owner,
        });
        if (numberOfAddresses >= 10) {
            throw new custom_errors_1.ConflictError("addresses_limit");
        }
        const address = await adress_model_1.default.create({ ...input });
        return address;
    }
}
exports.CreateLogic = CreateLogic;
