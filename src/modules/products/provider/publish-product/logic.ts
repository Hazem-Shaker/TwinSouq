import Product from "../../product.model";
import { Input, inputSchema } from "./input";
import {
  NotFoundError,
  InvalidCredentialsError,
} from "../../../../shared/utils/custom-errors";

export class PublishProductLogic {
  async execute(input: Input) {
    input = inputSchema.parse(input);
    const { id, provider } = input;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("product_not_found");

    if (product.provider.toString() !== provider.toString()) {
      throw new InvalidCredentialsError("product_not_found");
    }

    product.archive = false;
    await product.save();

    return null;
  }
}
