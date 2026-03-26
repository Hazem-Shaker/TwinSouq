"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginLogic = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../user.model"));
const input_1 = require("./input");
const tokenUtils_1 = require("../../../shared/utils/auth/tokenUtils");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class LoginLogic {
    constructor(verifyLogic) {
        this.verifyLogic = verifyLogic;
    }
    async login(data, language = "en") {
        data = input_1.inputSchema.parse(data);
        const { email, password, role } = data;
        const user = await user_model_1.default.findOne({
            $or: [{ email }, { phone: email }],
        });
        if (!user) {
            throw new custom_errors_1.NotFoundError("userNotRegistered"); // Use error key
        }
        if (!(await bcrypt_1.default.compare(password, user.password))) {
            throw new custom_errors_1.InvalidCredentialsError("wrongPassword"); // Use error key
        }
        const userData = user.toObject();
        // Remove sensitive or unnecessary fields
        delete userData.password;
        delete userData.__v;
        delete userData.otp;
        if (user.isVerified === false) {
            await this.verifyLogic.resendOtp({ email: user.email });
            return {
                user: userData,
            };
        }
        if (!user.roles.includes(role)) {
            throw new custom_errors_1.UnauthorizedError("userNotAllowed");
        }
        // Add `id` field to the response
        userData.id = user._id;
        // Generate a token
        const token = await (0, tokenUtils_1.generateToken)(user._id);
        return {
            token: token,
            user: userData,
        };
    }
}
exports.LoginLogic = LoginLogic;
