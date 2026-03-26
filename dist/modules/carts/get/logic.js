"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartLogic = void 0;
const input_1 = require("./input");
const agg_1 = require("./agg");
const cart_model_1 = __importDefault(require("../cart.model"));
class GetCartLogic {
    constructor() { }
    async get(input, language = "en") {
        const { user } = input_1.inputSchema.parse(input);
        let existingCart = await cart_model_1.default.findOne({ user });
        if (!existingCart) {
            existingCart = await cart_model_1.default.create({ user });
        }
        const cart = await cart_model_1.default.aggregate([
            {
                $match: {
                    user: user,
                },
            },
            ...(0, agg_1.aggregateCartDetails)(language),
        ]);
        if (!cart.length) {
            return {
                user,
                products: [],
                totalPrice: 0,
                id: existingCart._id,
            };
        }
        return cart[0];
    }
    async getForOrder(input) {
        const { user } = input_1.inputSchema.parse(input);
        let existingCart = await cart_model_1.default.findOne({ user });
        if (!existingCart) {
            existingCart = await cart_model_1.default.create({ user });
        }
        const cart = await cart_model_1.default.aggregate([
            {
                $match: {
                    user: user,
                },
            },
            ...(0, agg_1.aggregateForOrder)(),
        ]);
        if (!cart.length) {
            return {
                user,
                products: [],
                totalPrice: 0,
                id: existingCart._id,
            };
        }
        return cart[0];
    }
}
exports.GetCartLogic = GetCartLogic;
