"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserLogic = void 0;
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const user_model_1 = __importDefault(require("../user.model"));
const provider_model_1 = __importDefault(require("../../providers/provider.model"));
const product_model_1 = __importDefault(require("../../products/product.model"));
class DeleteUserLogic {
    async execute(input) {
        const { user } = input_1.inputSchema.parse(input);
        // Check if user exists
        const existingUser = await user_model_1.default.findById(user);
        if (!existingUser) {
            throw new custom_errors_1.NotFoundError("User not found");
        }
        // If user is a provider, delete associated provider data
        if (existingUser.roles.includes("provider")) {
            const provider = await provider_model_1.default.findOne({ user: user });
            if (provider) {
                // Delete all products associated with the provider
                await product_model_1.default.deleteMany({ provider: provider._id });
                // Delete the provider
                await provider_model_1.default.deleteOne({ _id: provider._id });
            }
        }
        // Delete the  user
        await user_model_1.default.deleteOne({ _id: user });
        return null;
    }
}
exports.DeleteUserLogic = DeleteUserLogic;
