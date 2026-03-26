"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogic = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const input_1 = require("./input");
const admin_model_1 = __importDefault(require("../admin.model"));
const config_1 = require("../../../shared/config");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
class CreateLogic {
    async create(data) {
        // Validate input data
        data = input_1.inputSchema.parse(data);
        // Check if the email already exists
        data = input_1.inputSchema.parse(data);
        const existingAdmin = await admin_model_1.default.findOne({ email: data.email });
        if (existingAdmin) {
            throw new custom_errors_1.InvalidCredentialsError("Email already in use.");
        }
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, config_1.config.bcrypt.saltRounds);
        data.password = hashedPassword;
        // Create the admin document
        const admin = await admin_model_1.default.create(data);
        // Convert admin document to a plain object
        const adminData = admin.toObject();
        // Return the created admin
        return "Admin created successfully";
    }
}
exports.CreateLogic = CreateLogic;
