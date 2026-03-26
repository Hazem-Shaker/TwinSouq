"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentsCartService = void 0;
const installmentsCart_model_1 = __importDefault(require("./installmentsCart.model"));
const input_1 = require("./input");
const agg_1 = require("./agg");
class InstallmentsCartService {
    constructor() { }
    async addToCart(input, language = "en") {
        const { user, product, variant, installmentOption } = input_1.addToCartInputSchema.parse(input);
        let existingCart = await installmentsCart_model_1.default.findOne({ user });
        if (!existingCart) {
            existingCart = await installmentsCart_model_1.default.create({ user });
        }
        existingCart.products = existingCart.products.filter((value) => value.product.toString() !== product.toString());
        existingCart.products.push({ product, variant, installmentOption });
        await existingCart.save();
        return existingCart;
    }
    async removeFromCart(input, language = "en") {
        const { user, product } = input_1.removeFromCartInputSchema.parse(input);
        let existingCart = await installmentsCart_model_1.default.findOne({ user });
        if (!existingCart) {
            existingCart = await installmentsCart_model_1.default.create({ user });
        }
        existingCart.products = existingCart.products.filter((value) => value.product.toString() !== product.toString());
        await existingCart.save();
        return existingCart;
    }
    async getCart(input, language = "en") {
        const { user } = input_1.getCartInputSchema.parse(input);
        let existingCart = await installmentsCart_model_1.default.findOne({ user });
        if (!existingCart) {
            existingCart = await installmentsCart_model_1.default.create({ user });
        }
        const cart = await installmentsCart_model_1.default.aggregate([
            {
                $match: {
                    user,
                },
            },
            ...(0, agg_1.aggregateCartData)(language),
            {
                $project: {
                    _id: 0,
                    products: 1,
                },
            },
        ]);
        return cart[0].products;
    }
}
exports.InstallmentsCartService = InstallmentsCartService;
