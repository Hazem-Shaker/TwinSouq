"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogic = void 0;
const input_1 = require("./input");
const settings_model_1 = __importDefault(require("../settings.model"));
class UpdateLogic {
    constructor(getLogic) {
        this.getLogic = getLogic;
    }
    async update(settings, language = "en") {
        settings = input_1.inputSchema.parse(settings);
        const exitsSettings = await settings_model_1.default.findOne({});
        if (!exitsSettings) {
            await settings_model_1.default.create({});
        }
        await settings_model_1.default.findOneAndUpdate({}, {
            ...settings,
            headerLogo: settings.headerLogo[0]._id,
            footerLogo: settings.footerLogo[0]._id,
        });
        const response = await this.getLogic.get();
        return response;
    }
}
exports.UpdateLogic = UpdateLogic;
