import { ReviewService } from "./review.service";
import { Request, Response, NextFunction } from "express";

export class ReviewController {
  constructor(public reviewService: ReviewService) {}

  async listReveiws(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reviewService.listReveiws(
        req.pagination ?? {},
        req.query ?? {},
        req.language
      );
      res.sendSuccess(req.t("reviews.fetched"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reviewService.createReview(
        req.user.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("review.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async getReviewStats(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reviewService.getReviewsStats(
        req.query,
        req.language
      );
      res.sendSuccess(req.t("review.stats"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
