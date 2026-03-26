"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async listReveiws(req, res, next) {
        try {
            const response = await this.reviewService.listReveiws(req.pagination ?? {}, req.query ?? {}, req.language);
            res.sendSuccess(req.t("reviews.fetched"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
    async createReview(req, res, next) {
        try {
            const response = await this.reviewService.createReview(req.user.id, req.body, req.language);
            res.sendSuccess(req.t("review.created"), response, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getReviewStats(req, res, next) {
        try {
            const response = await this.reviewService.getReviewsStats(req.query, req.language);
            res.sendSuccess(req.t("review.stats"), response, 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReviewController = ReviewController;
