import Product from "../../product.model";
import Variant from "../../product-variants/variant.model";
import { inputSchema, Input } from "./input";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../../../../shared/utils/custom-errors";
import { deleteImages, markFilesAsUsed } from "../../../../shared/utils/files";
import { getOptionsString } from "../../product-variants/variant.service";

export class UpdateProductVariantLogic {
  constructor() {}
  async update(input: Input, language: string = "en") {
    input = inputSchema.parse(input);

    const { variantId, provider, data } = input;

    const productVariant = await Variant.findById(variantId);

    if (!productVariant) {
      throw new NotFoundError("variant_not_found");
    }

    const product = await Product.findById(productVariant.product);
    if (!product) {
      throw new NotFoundError("product_not_found");
    }

    if (product.provider.toString() !== provider.toString()) {
      throw new NotFoundError("product_not_found");
    }

    if (data.salePrice && data.price && data.salePrice > data.price) {
      throw new ValidationError("sale_price_higher_than_price");
    }

    const updatedProductVariant = await Variant.findByIdAndUpdate(
      variantId,
      data,
      { new: true }
    );

    const newImages = data.images?.map((i) => i._id) || [];

    await markFilesAsUsed(newImages);

    if (productVariant.images.length) await deleteImages(productVariant.images);

    return updatedProductVariant;
  }
}
