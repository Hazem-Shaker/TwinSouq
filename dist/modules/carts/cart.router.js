"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRouter = void 0;
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_1 = require("../../shared/middlewares/auth");
class CartRouter {
    constructor(cartService) {
        this.cartService = cartService;
        this.cartController = new cart_controller_1.CartController(this.cartService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.put("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.cartController.addProductToCart.bind(this.cartController));
        router.get("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.cartController.getCart.bind(this.cartController));
        router.get("/installment", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.cartController.getInstallmentCart.bind(this.cartController));
        router.delete("/installment/:product", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.cartController.removeFromInstallmentCart.bind(this.cartController));
        router.put("/installment", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.cartController.addToInstallmentCart.bind(this.cartController));
        return router;
    }
}
exports.CartRouter = CartRouter;
