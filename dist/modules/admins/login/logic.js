"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginLogic = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_model_1 = __importDefault(require("../admin.model"));
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const tokenUtils_1 = require("../../../shared/utils/auth/tokenUtils");
class LoginLogic {
    async login(data) {
        data = input_1.inputSchema.parse(data);
        const { email, password } = data;
        const admin = await admin_model_1.default.findOne({ email });
        if (!admin || !(await bcrypt_1.default.compare(password, admin.password))) {
            throw new custom_errors_1.InvalidCredentialsError("Invalid email or password.");
        }
        // Convert admin document to a plain object
        const adminData = admin.toObject();
        // Remove sensitive or unnecessary fields from the admin data
        delete adminData.password;
        delete adminData.__v;
        // Add `id` field to the response
        adminData.id = admin._id;
        const token = await (0, tokenUtils_1.generateToken)(admin._id);
        delete adminData._id;
        return { admin: adminData, token };
    }
}
exports.LoginLogic = LoginLogic;
