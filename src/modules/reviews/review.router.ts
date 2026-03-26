import { Router } from "express";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import paginationMiddleware from "../../shared/middlewares/pagination";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";

export class ReviewRouter {
  reviewController: ReviewController;
  userAuthMiddleware: UserAuthMiddleware;
  constructor(public reviewService: ReviewService) {
    this.reviewController = new ReviewController(this.reviewService);
    this.userAuthMiddleware = new UserAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    router.get(
      "/",
      paginationMiddleware,
      this.reviewController.listReveiws.bind(this.reviewController)
    );

    router.post(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.reviewController.createReview.bind(this.reviewController)
    );

    router.get(
      "/stats",

      this.reviewController.getReviewStats.bind(this.reviewController)
    );

    return router;
  }
}
