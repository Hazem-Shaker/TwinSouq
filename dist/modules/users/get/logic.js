"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserLogic = void 0;
const input_1 = require("./input");
const user_model_1 = __importDefault(require("../user.model"));
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class GetUserLogic {
    async getUser({ userId }, language = "en") {
        const parsedData = input_1.inputSchema.parse({ userId });
        userId = parsedData.userId;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Use error key
        }
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.__v;
        delete userObj.otp;
        return userObj;
    }
}
exports.GetUserLogic = GetUserLogic;
