import { ProductService } from "../../products/product.service";
import { inputSchema, Input } from "./input";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/utils/custom-errors";
import Cart from "../cart.model";

export class AddProductLogic {
  constructor(public productService: ProductService) {}

  async update(input: Input, language: string = "en") {
    const { productId, variantId, quantity, user } = inputSchema.parse(input);

    const variant = await this.productService.getVariantData(
      variantId,
      productId
    );

    if (!variant) {
      throw new NotFoundError("product_with_variant_not_found");
    }

    // Check cart
    const existingCart = await Cart.findOne({ user: user });
    if (!existingCart) {
      await Cart.create({ user });
    }

    const cart = await Cart.findOne({ user: user });

    if (!cart) {
      throw new Error("error");
    }

    console.log(cart.products);

    cart.products = cart.products.filter(
      (product) => product.variant.toString() !== variantId.toString()
    );

    if (quantity > variant.stock) {
      throw new ConflictError("stock_quantity_is_less");
    }

    if (quantity > 0) {
      cart.products.push({
        id: productId,
        variant: variantId,
        quantity,
      });
    }

    await cart.save({});

    return null;
  }
}
