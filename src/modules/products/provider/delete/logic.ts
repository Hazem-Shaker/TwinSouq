import Product from "../../product.model";
import Variant from "../../product-variants/variant.model";
import { Input, inputSchema } from "./input";
import { NotFoundError } from "../../../../shared/utils/custom-errors";
import { deleteImages, markFilesAsUsed } from "../../../../shared/utils/files";

export class DeleteProductLogic {
  constructor() {}

  async remove(input: Input, language: string = "en") {
    input = inputSchema.parse(input);
    const { id, provider } = input;

    const product = await Product.findById(id);

    console.log(product);

    if (!product) {
      throw new NotFoundError("product_not_found");
    }

    if (product?.provider?.toString() !== provider.toString()) {
      throw new NotFoundError("product_not_found");
    }

    const variants = await Variant.find({ product });
    let toDeleteImages: any[] = [...product.images];
    for (let variant of variants) {
      toDeleteImages = [...toDeleteImages, ...variant.images];
    }

    await Product.findByIdAndDelete(product._id);
    await Variant.deleteMany({ product: product._id });

    await deleteImages(toDeleteImages);

    return null;
  }
}
