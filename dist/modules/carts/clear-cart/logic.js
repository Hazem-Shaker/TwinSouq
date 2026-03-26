"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCartLogic = void 0;
const cart_model_1 = __importDefault(require("../cart.model"));
class ClearCartLogic {
    constructor() { }
    async clear(input) {
        const cart = await cart_model_1.default.findOneAndDelete({ user: input.user });
        return cart;
    }
}
exports.ClearCartLogic = ClearCartLogic;
