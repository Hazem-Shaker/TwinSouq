"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUser = void 0;
const tokenUtils_1 = require("../../utils/auth/tokenUtils");
const user_model_1 = __importDefault(require("../../../modules/users/user.model"));
class CheckUser {
    async check(req, res, next) {
        try {
            const token = req?.headers?.authorization?.split(" ")[1];
            if (token) {
                const decoded = await (0, tokenUtils_1.validateToken)(token);
                if (decoded) {
                    const user = decoded;
                    const userData = (await user_model_1.default.findById(user.id));
                    if (userData) {
                        req.user = {
                            id: user.id,
                            email: userData.email,
                            name: userData.name,
                            type: "user",
                        };
                    }
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CheckUser = CheckUser;
