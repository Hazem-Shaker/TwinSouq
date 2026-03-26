import { Input, inputSchema } from "./input";
import Review from "../review.model";
import {
  ConflictError,
  NotFoundError,
} from "../../../shared/utils/custom-errors";
import { ProductService } from "../../products/product.service";

export class CreateReviewLogic {
  constructor(public productService: ProductService) {}

  async create(input: Input, language: string = "en") {
    input = inputSchema.parse(input);

    const existingReview = await Review.findOne({
      user: input.user,
      item: input.item,
    });

    if (existingReview) {
      throw new ConflictError("user_revied_item_before");
    }

    const review = await Review.create({
      user: input.user,
      item: input.item,
      rating: input.rating,
      comment: input.comment ?? null,
      itemType: "product",
    });

    const updated = await this.productService.addReview(
      input.item,
      input.rating
    );
    if (!updated) {
      await Review.findByIdAndDelete(review._id);
      throw new NotFoundError("product_not_found");
    }

    return review;
  }
}
