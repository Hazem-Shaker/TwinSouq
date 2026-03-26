import { ProductService } from "../products/product.service";
import { ReviewRouter } from "./review.router";
import { ReviewService } from "./review.service";

export class ReviewModule {
  private reviewRouter: ReviewRouter;
  reviewService: ReviewService;
  constructor(public productService: ProductService) {
    this.reviewService = new ReviewService(this.productService);
    this.reviewRouter = new ReviewRouter(this.reviewService);
  }

  routerFactory() {
    return this.reviewRouter.createRouter();
  }
}
