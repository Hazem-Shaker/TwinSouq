"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const category_service_1 = require("./category.service");
const category_router_1 = require("./category.router");
class CategoryModule {
    constructor() {
        this.categoryService = new category_service_1.CategoryService();
        this.categoryRouter = new category_router_1.CategoryRouter(this.categoryService);
    }
    routerFactory() {
        return this.categoryRouter.createRouter();
    }
}
exports.CategoryModule = CategoryModule;
