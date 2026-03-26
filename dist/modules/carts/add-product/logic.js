"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductLogic = void 0;
const input_1 = require("./input");
const custom_errors_1 = require("../../../shared/utils/custom-errors");
const cart_model_1 = __importDefault(require("../cart.model"));
class AddProductLogic {
    constructor(productService) {
        this.productService = productService;
    }
    async update(input, language = "en") {
        const { productId, variantId, quantity, user } = input_1.inputSchema.parse(input);
        const variant = await this.productService.getVariantData(variantId, productId);
        if (!variant) {
            throw new custom_errors_1.NotFoundError("product_with_variant_not_found");
        }
        // Check cart
        const existingCart = await cart_model_1.default.findOne({ user: user });
        if (!existingCart) {
            await cart_model_1.default.create({ user });
        }
        const cart = await cart_model_1.default.findOne({ user: user });
        if (!cart) {
            throw new Error("error");
        }
        console.log(cart.products);
        cart.products = cart.products.filter((product) => product.variant.toString() !== variantId.toString());
        if (quantity > variant.stock) {
            throw new custom_errors_1.ConflictError("stock_quantity_is_less");
        }
        if (quantity > 0) {
            cart.products.push({
                id: productId,
                variant: variantId,
                quantity,
            });
        }
        await cart.save({});
        return null;
    }
}
exports.AddProductLogic = AddProductLogic;
