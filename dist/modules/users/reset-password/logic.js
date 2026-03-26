"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordLogic = void 0;
const user_model_1 = __importDefault(require("../user.model"));
const input_1 = require("./input");
const otp_1 = require("../../../shared/utils/otp");
const tempTokenUtils_1 = require("../../../shared/utils/auth/tempTokenUtils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../../shared/config");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class ResetPasswordLogic {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async resetRequest({ email }, language = "en") {
        const parsedData = input_1.requestResetPasswordInputSchema.parse({ email });
        email = parsedData.email;
        const user = await user_model_1.default.findOne({ $or: [{ email }, { phone: email }] });
        if (!user) {
            throw new custom_errors_1.NotFoundError("userNotFound"); // Throw error with key
        }
        const otpCode = (0, otp_1.generateOtp)();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
        user.otp = { code: otpCode, expiry: otpExpiry };
        await user.save();
        await this.mailerService.sendOtpEmail(user.email, otpCode);
        return null;
    }
    async resetPasswordOtpVerify({ email, otp }, language = "en") {
        const parsedData = input_1.otpVerifyInputSchema.parse({ email, otp });
        email = parsedData.email;
        otp = parsedData.otp;
        const user = await user_model_1.default.findOne({ $or: [{ email }, { phone: email }] });
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Throw error with key
        }
        if (!user.otp) {
            throw new custom_errors_1.InvalidCredentialsError("otpNotGenerated"); // Throw error with key
        }
        if (user.otp.expiry < new Date()) {
            throw new custom_errors_1.InvalidCredentialsError("otpExpired"); // Throw error with key
        }
        if (user.otp.code !== otp) {
            throw new custom_errors_1.InvalidCredentialsError("invalidOtp"); // Throw error with key
        }
        user.otp = undefined;
        await user.save();
        const tempToken = await (0, tempTokenUtils_1.generateTempToken)(user._id, user.email);
        return { token: tempToken };
    }
    async resetPassword({ password, token }, language = "en") {
        const parsedData = input_1.resetPasswordInputSchema.parse({ password, token });
        password = parsedData.password;
        token = parsedData.token;
        const data = await (0, tempTokenUtils_1.validateTempToken)(token);
        if (!data) {
            throw new custom_errors_1.InvalidCredentialsError("invalidToken"); // Throw error with key
        }
        const user = await user_model_1.default.findById(data.id);
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Throw error with key
        }
        const hashedPassword = await bcrypt_1.default.hash(password, config_1.config.bcrypt.saltRounds);
        user.password = hashedPassword;
        await user.save();
        await (0, tempTokenUtils_1.deleteTempToken)(token);
        return null;
    }
}
exports.ResetPasswordLogic = ResetPasswordLogic;
