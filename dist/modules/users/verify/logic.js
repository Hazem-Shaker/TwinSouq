"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyLogic = void 0;
const input_1 = require("./input");
const user_model_1 = __importDefault(require("../user.model"));
const otp_1 = require("../../../shared/utils/otp");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const tokenUtils_1 = require("../../../shared/utils/auth/tokenUtils");
class VerifyLogic {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async verifyUser(data, language = "en") {
        data = input_1.veirfyInputSchema.parse(data);
        const { otp, email } = data;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Use error key
        }
        if (!user.otp) {
            throw new custom_errors_1.InvalidCredentialsError("otpNotGenerated"); // Use error key
        }
        if (user.otp.code !== otp) {
            throw new custom_errors_1.InvalidCredentialsError("invalidOtp"); // Use error key
        }
        if (user.otp.expiry < new Date()) {
            throw new custom_errors_1.InvalidCredentialsError("otpExpired"); // Use error key
        }
        user.isVerified = true;
        await user.save();
        await this.mailerService.sendWelcomeEmail(user.email, user.name);
        // Convert user document to a plain object
        const userData = user.toObject();
        // Remove sensitive or unnecessary fields
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        // Add `id` field to the response
        userData.id = user._id;
        // Generate a token
        const token = await (0, tokenUtils_1.generateToken)(user._id);
        return {
            token: token,
            user: userData,
        };
    }
    async resendOtp(data, language = "en") {
        data = input_1.resendOtpInputSchema.parse(data);
        const user = await user_model_1.default.findOne({
            email: data.email,
        });
        if (!user) {
            throw new custom_errors_1.InvalidCredentialsError("userNotFound"); // Use error key
        }
        if (user.isVerified) {
            throw new custom_errors_1.InvalidCredentialsError("alreadyVerified"); // Use error key
        }
        const otpCode = (0, otp_1.generateOtp)(); // Generate an OTP
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
        user.otp = { code: otpCode, expiry: otpExpiry };
        await user.save();
        await this.mailerService.sendOtpEmail(user.email, otpCode);
        const userData = user.toObject();
        // Remove sensitive or unnecessary fields
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        // Add `id` field to the response
        userData.id = user._id;
        return userData;
    }
}
exports.VerifyLogic = VerifyLogic;
