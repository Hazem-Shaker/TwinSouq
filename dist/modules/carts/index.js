"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const cart_router_1 = require("./cart.router");
const cart_service_1 = require("./cart.service");
class CartModule {
    constructor(productService) {
        this.productService = productService;
        this.cartService = new cart_service_1.CartService(this.productService);
        this.cartRouter = new cart_router_1.CartRouter(this.cartService);
    }
    routerFactory() {
        return this.cartRouter.createRouter();
    }
}
exports.CartModule = CartModule;
