"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogic = void 0;
const settings_model_1 = __importDefault(require("../settings.model"));
class CreateLogic {
    async create() {
        const settings = await settings_model_1.default.findOne({});
        if (!settings) {
            await settings_model_1.default.create({});
        }
    }
}
exports.CreateLogic = CreateLogic;
