"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_model_1 = __importDefault(require("./cart.model"));
const add_product_1 = require("./add-product");
const get_1 = require("./get");
const clear_cart_1 = require("./clear-cart");
const custom_errors_1 = require("../../shared/utils/custom-errors");
const custom_errors_2 = require("../../shared/utils/custom-errors");
class CartService {
    constructor(productService) {
        this.productService = productService;
        this.addProductLogic = new add_product_1.AddProductLogic(this.productService);
        this.getCartLogic = new get_1.GetCartLogic();
        this.clearCartLogic = new clear_cart_1.ClearCartLogic();
    }
    addProductToCart(user, data, language) {
        return this.addProductLogic.update({ user, ...data }, language);
    }
    getCart(user, language) {
        return this.getCartLogic.get({ user }, language);
    }
    getCartForOrder(user) {
        return this.getCartLogic.getForOrder({ user });
    }
    clearCart(user) {
        return this.clearCartLogic.clear({ user });
    }
    async makeCartBusy(id, session) {
        const cart = await cart_model_1.default.findById(id);
        if (!cart) {
            throw new custom_errors_2.NotFoundError("no_data");
        }
        if (cart.status !== "free") {
            throw new custom_errors_1.ConflictError("cart_is_not_free");
        }
        cart.status = "in-transaction";
        await cart.save({ session });
    }
    async makeCartFree(id) {
        if (!id)
            return;
        const cart = await cart_model_1.default.findOne({ user: id });
        if (!cart) {
            throw new custom_errors_2.NotFoundError("no_data");
        }
        cart.status = "free";
        await cart.save();
    }
}
exports.CartService = CartService;
