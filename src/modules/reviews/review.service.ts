import { ListReviewsLogic } from "./list";
import { CreateReviewLogic } from "./create";
import { ProductService } from "../products/product.service";
import { GetReviewsStatsLogic } from "./get-stats";

export class ReviewService {
  private listReviewsLogic: ListReviewsLogic;
  private createReviewLogic: CreateReviewLogic;
  private getReviewStatsLogic: GetReviewsStatsLogic;
  constructor(public productService: ProductService) {
    this.listReviewsLogic = new ListReviewsLogic();
    this.getReviewStatsLogic = new GetReviewsStatsLogic();
    this.createReviewLogic = new CreateReviewLogic(this.productService);
  }

  listReveiws(pagination: any, query: any, language: string) {
    return this.listReviewsLogic.list({ pagination, query }, language);
  }

  createReview(user: any, data: any, language: string) {
    return this.createReviewLogic.create({ user, ...data }, language);
  }

  getReviewsStats(query: any, language: string) {
    return this.getReviewStatsLogic.get({ query }, language);
  }
}
