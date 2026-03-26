"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const installmentsCart_service_1 = require("./installmentsCart/installmentsCart.service");
class CartController {
    constructor(cartService) {
        this.cartService = cartService;
        this.installmentsCartService = new installmentsCart_service_1.InstallmentsCartService();
    }
    async addProductToCart(req, res, next) {
        try {
            const { user, body } = req;
            const response = await this.cartService.addProductToCart(user.id, body, req.language);
            res.sendSuccess(req.t("cart.updated"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getCart(req, res, next) {
        try {
            const { user } = req;
            const response = await this.cartService.getCart(user.id, req.language);
            res.sendSuccess(req.t("cart.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async addToInstallmentCart(req, res, next) {
        try {
            const { user } = req;
            const response = await this.installmentsCartService.addToCart({
                user: user.id,
                ...req.body,
            }, req.language);
            res.sendSuccess(req.t("cart.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async removeFromInstallmentCart(req, res, next) {
        try {
            const { user } = req;
            const response = await this.installmentsCartService.removeFromCart({
                user: user.id,
                product: req.params.product,
            }, req.language);
            res.sendSuccess(req.t("cart.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getInstallmentCart(req, res, next) {
        try {
            const { user } = req;
            const response = await this.installmentsCartService.getCart({ user: user.id }, req.language);
            res.sendSuccess(req.t("cart.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
