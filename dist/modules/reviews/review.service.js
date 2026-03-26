"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const list_1 = require("./list");
const create_1 = require("./create");
const get_stats_1 = require("./get-stats");
class ReviewService {
    constructor(productService) {
        this.productService = productService;
        this.listReviewsLogic = new list_1.ListReviewsLogic();
        this.getReviewStatsLogic = new get_stats_1.GetReviewsStatsLogic();
        this.createReviewLogic = new create_1.CreateReviewLogic(this.productService);
    }
    listReveiws(pagination, query, language) {
        return this.listReviewsLogic.list({ pagination, query }, language);
    }
    createReview(user, data, language) {
        return this.createReviewLogic.create({ user, ...data }, language);
    }
    getReviewsStats(query, language) {
        return this.getReviewStatsLogic.get({ query }, language);
    }
}
exports.ReviewService = ReviewService;
