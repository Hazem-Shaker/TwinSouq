"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthMiddleware = void 0;
const tokenUtils_1 = require("../../utils/auth/tokenUtils");
const admin_model_1 = __importDefault(require("../../../modules/admins/admin.model"));
const custom_errors_1 = require("../../utils/custom-errors");
class AdminAuthMiddleware {
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
            const userData = (await admin_model_1.default.findById(user.id));
            if (!userData) {
                throw new custom_errors_1.UnauthorizedError("Admin not found");
            }
            req.user = {
                id: user.id,
                email: userData.email,
                name: userData.name,
                type: "admin",
            };
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminAuthMiddleware = AdminAuthMiddleware;
