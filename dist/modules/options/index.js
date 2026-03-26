"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionModule = void 0;
const option_router_1 = require("./option.router");
const option_service_1 = require("./option.service");
class OptionModule {
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.optionService = new option_service_1.OptionService(this.categoryService);
        this.optionRouter = new option_router_1.OptionRouter(this.optionService);
    }
    routerFactory() {
        return this.optionRouter.createRouter();
    }
}
exports.OptionModule = OptionModule;
