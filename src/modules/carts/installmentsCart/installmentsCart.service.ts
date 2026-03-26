import InstallmentsCart from "./installmentsCart.model";

import {
  AddToCartInput,
  addToCartInputSchema,
  GetCartInput,
  getCartInputSchema,
  RemoveFromCartInput,
  removeFromCartInputSchema,
} from "./input";

import { aggregateCartData } from "./agg";

export class InstallmentsCartService {
  constructor() {}

  async addToCart(input: AddToCartInput, language: string = "en") {
    const { user, product, variant, installmentOption } =
      addToCartInputSchema.parse(input);
    let existingCart = await InstallmentsCart.findOne({ user });
    if (!existingCart) {
      existingCart = await InstallmentsCart.create({ user });
    }

    existingCart.products = existingCart.products.filter(
      (value) => value.product.toString() !== product.toString()
    );

    existingCart.products.push({ product, variant, installmentOption });

    await existingCart.save();

    return existingCart;
  }

  async removeFromCart(input: RemoveFromCartInput, language: string = "en") {
    const { user, product } = removeFromCartInputSchema.parse(input);
    let existingCart = await InstallmentsCart.findOne({ user });
    if (!existingCart) {
      existingCart = await InstallmentsCart.create({ user });
    }
    existingCart.products = existingCart.products.filter(
      (value) => value.product.toString() !== product.toString()
    );

    await existingCart.save();

    return existingCart;
  }

  async getCart(input: GetCartInput, language: string = "en") {
    const { user } = getCartInputSchema.parse(input);
    let existingCart = await InstallmentsCart.findOne({ user });
    if (!existingCart) {
      existingCart = await InstallmentsCart.create({ user });
    }
    const cart = await InstallmentsCart.aggregate([
      {
        $match: {
          user,
        },
      },
      ...aggregateCartData(language),
      {
        $project: {
          _id: 0,
          products: 1,
        },
      },
    ]);

    return cart[0].products;
  }
}
