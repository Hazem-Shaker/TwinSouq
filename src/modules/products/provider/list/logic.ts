import { inputSchema, Input } from "./input";
import Variant from "../../product-variants/variant.model";
import Product from "../../product.model";
import {
  NotFoundError,
  InvalidCredentialsError,
} from "../../../../shared/utils/custom-errors";
import { productListForProvider } from "../../../../shared/utils/aggregations/product";
import { parseSearchQuery } from "./query-parser";

export class ListProductsForProviderLogic {
  async list(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { provider, pagination, query } = input;

    console.log(provider);
    const products = await Product.aggregate([
      ...parseSearchQuery(query, provider),
      { $sort: { createdAt: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      ...productListForProvider(language),
    ]);

    const countQuery: { totalResults: number }[] = await Product.aggregate([
      ...parseSearchQuery(query, provider),
      {
        $count: "totalResults",
      },
    ]);

    const totalCount = countQuery[0]?.totalResults ?? 0;
    const totalPages = Math.ceil(totalCount / pagination.limit);

    return {
      results: products,
      totalCount,
      totalPages,
      currentPage: pagination.page,
    };
  }
}
