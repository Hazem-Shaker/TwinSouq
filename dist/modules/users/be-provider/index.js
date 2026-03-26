"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeProviderLogic = void 0;
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const user_model_1 = __importDefault(require("../user.model"));
class BeProviderLogic {
    constructor() { }
    async beProvider(id, language = "en") {
        const user = await user_model_1.default.findById(id);
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Use error key
        }
        if (user.roles.includes("provider")) {
            throw new custom_errors_1.InvalidCredentialsError("alreadyProvider"); // Use error key
        }
        user.roles.push("provider");
        await user.save();
        const userData = user.toObject();
        // Remove sensitive or unnecessary fields
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        userData.id = user._id;
        return userData;
    }
}
exports.BeProviderLogic = BeProviderLogic;
