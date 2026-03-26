import { Input, inputSchema } from "./input";
import Product from "../../product.model";
import { productDetailsForProvider } from "../../../../shared/utils/aggregations/product";
import { NotFoundError } from "../../../../shared/utils/custom-errors";

export class GetProductDetailForProviderLogic {
  constructor() {}

  async get(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { provider, product } = input;
    console.log(provider);

    const productDetails = await Product.aggregate([
      {
        $match: {
          _id: product,
          provider: provider,
        },
      },
      ...productDetailsForProvider(language),
    ]);

    if (!productDetails.length) throw new NotFoundError("product_not_found");

    return productDetails[0];
  }
}
