"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const review_router_1 = require("./review.router");
const review_service_1 = require("./review.service");
class ReviewModule {
    constructor(productService) {
        this.productService = productService;
        this.reviewService = new review_service_1.ReviewService(this.productService);
        this.reviewRouter = new review_router_1.ReviewRouter(this.reviewService);
    }
    routerFactory() {
        return this.reviewRouter.createRouter();
    }
}
exports.ReviewModule = ReviewModule;
