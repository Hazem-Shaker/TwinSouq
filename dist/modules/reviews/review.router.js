"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const pagination_1 = __importDefault(require("../../shared/middlewares/pagination"));
const auth_1 = require("../../shared/middlewares/auth");
class ReviewRouter {
    constructor(reviewService) {
        this.reviewService = reviewService;
        this.reviewController = new review_controller_1.ReviewController(this.reviewService);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.get("/", pagination_1.default, this.reviewController.listReveiws.bind(this.reviewController));
        router.post("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.reviewController.createReview.bind(this.reviewController));
        router.get("/stats", this.reviewController.getReviewStats.bind(this.reviewController));
        return router;
    }
}
exports.ReviewRouter = ReviewRouter;
