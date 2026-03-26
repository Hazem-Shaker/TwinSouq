"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogic = void 0;
const input_1 = require("./input");
const adress_model_1 = __importDefault(require("../adress.model"));
class ListLogic {
    constructor() { }
    async list(input, language = "en") {
        const { owner } = input_1.inputSchema.parse(input);
        const addresses = await adress_model_1.default.find({ owner });
        return addresses;
    }
}
exports.ListLogic = ListLogic;
