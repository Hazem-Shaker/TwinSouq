"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterLogic = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const input_1 = require("./input");
const user_model_1 = __importDefault(require("../user.model"));
const config_1 = require("../../../shared/config");
const otp_1 = require("../../../shared/utils/otp");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class RegisterLogic {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    parseInput(data) {
        data = input_1.inputSchema.parse(data);
        const parsedData = {
            ...data,
            roles: ["user"],
        };
        if (data.role === "provider") {
            parsedData.roles.push("provider");
        }
        delete parsedData.role;
        return parsedData;
    }
    async registerUser(input, language = "en") {
        // Check if the email already exists
        const data = this.parseInput(input);
        const existingUser = await user_model_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new custom_errors_1.InvalidCredentialsError("emailInUse"); // Use error key
        }
        const existingPhone = await user_model_1.default.findOne({ phone: data.phone });
        if (existingPhone) {
            throw new custom_errors_1.InvalidCredentialsError("phoneInUse"); // Use error key
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(data.password, config_1.config.bcrypt.saltRounds);
        data.password = hashedPassword;
        // Create a new user
        const otpCode = (0, otp_1.generateOtp)(); // Generate an OTP
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
        const newUser = await user_model_1.default.create({
            ...data,
            otp: { code: otpCode, expiry: otpExpiry },
        });
        // Send the OTP to the user's email
        await this.mailerService.sendOtpEmail(newUser.email, otpCode);
        const userData = newUser.toObject();
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        return userData;
    }
}
exports.RegisterLogic = RegisterLogic;
