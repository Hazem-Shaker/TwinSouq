"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderAuthMiddleware = void 0;
const tokenUtils_1 = require("../../utils/auth/tokenUtils");
const user_model_1 = __importDefault(require("../../../modules/users/user.model"));
const provider_model_1 = __importDefault(require("../../../modules/providers/provider.model"));
const custom_errors_1 = require("../../utils/custom-errors");
class ProviderAuthMiddleware {
    async authenticate(req, res, next) {
        try {
            const token = req?.headers?.authorization?.split(" ")[1];
            if (!token) {
                throw new custom_errors_1.UnauthorizedError("No token provided");
            }
            const decoded = await (0, tokenUtils_1.validateToken)(token);
            if (!decoded) {
                throw new custom_errors_1.UnauthorizedError("Invalid token");
            }
            const user = decoded;
            const userData = (await user_model_1.default.findById(user.id));
            if (!userData) {
                throw new custom_errors_1.UnauthorizedError("User not found");
            }
            if (!userData.roles.includes("provider")) {
                throw new custom_errors_1.UnauthorizedError("User is not a provider");
            }
            // search for the provider profile
            const provider = await provider_model_1.default.findOne({ user: user.id });
            if (!provider) {
                throw new custom_errors_1.IncompleteUserData("complete_your_profile");
            }
            // add provider id to the user.request object
            req.user = {
                id: user.id,
                providerId: provider?._id?.toString() ? provider._id.toString() : "",
                email: userData.email,
                name: userData.name,
                type: "provider",
            };
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProviderAuthMiddleware = ProviderAuthMiddleware;
