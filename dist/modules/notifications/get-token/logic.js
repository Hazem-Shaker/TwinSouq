"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenLogic = void 0;
const input_1 = require("./input");
const utils_1 = require("../utils");
class GetTokenLogic {
    constructor() { }
    async getToken(input) {
        const { userId, type } = input_1.getTokenInputSchema.parse(input);
        const id = `${type}-${userId.toString()}`;
        const { token } = await (0, utils_1.getTokenForUser)(id);
        return {
            token,
        };
    }
}
exports.GetTokenLogic = GetTokenLogic;
