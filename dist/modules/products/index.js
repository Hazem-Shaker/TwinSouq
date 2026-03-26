"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const product_router_1 = require("./product.router");
const product_service_1 = require("./product.service");
class ProductModule {
    constructor(categoryService, optionService, providerService) {
        this.categoryService = categoryService;
        this.optionService = optionService;
        this.providerService = providerService;
        this.optionService = optionService;
        this.categoryService = categoryService;
        this.productService = new product_service_1.ProductService(this.categoryService, this.optionService, this.providerService);
        this.productRouter = new product_router_1.ProductRouter(this.productService);
    }
    routerFactory() {
        return this.productRouter.createRouter();
    }
}
exports.ProductModule = ProductModule;
