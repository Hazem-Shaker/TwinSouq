import { inputSchema, Input } from "./input";
import Variant from "../../product-variants/variant.model";
import Product from "../../product.model";
import {
  NotFoundError,
  InvalidCredentialsError,
} from "../../../../shared/utils/custom-errors";
import { aggregateForProvider } from "../../../../shared/utils/aggregations/variant";

export class ListProductVariantsLogic {
  async list(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { provider, pagination, product } = input;

    const productData = await Product.findById(product);

    if (!productData) {
      throw new NotFoundError("product_not_found");
    }

    if (productData.provider.toString() !== provider.toString()) {
      throw new NotFoundError("product_not_found");
    }

    const variants = await Variant.aggregate([
      { $match: { product: productData._id } },
      { $sort: { createdAt: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      ...aggregateForProvider(language),
    ]);

    const totalCount = await Variant.countDocuments({
      product: productData._id,
    });
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: variants,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
