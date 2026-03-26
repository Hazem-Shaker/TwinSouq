"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordLogic = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const input_1 = require("./input");
const user_model_1 = __importDefault(require("../user.model"));
const config_1 = require("../../../shared/config");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class UpdatePasswordLogic {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async updatePassword({ data, userId }, language = "en") {
        const parsedData = input_1.inputSchema.parse({ data, userId });
        data = parsedData.data;
        userId = parsedData.userId;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Use error key
        }
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new custom_errors_1.InvalidCredentialsError("invalidPassword"); // Use error key
        }
        const hashedPassword = await bcrypt_1.default.hash(data.newPassword, config_1.config.bcrypt.saltRounds);
        await user_model_1.default.findByIdAndUpdate(userId, { password: hashedPassword });
        const userData = user.toObject();
        // Remove sensitive or unnecessary fields
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        userData.id = user._id;
        return userData;
    }
}
exports.UpdatePasswordLogic = UpdatePasswordLogic;
