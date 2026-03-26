import { Input, inputSchema } from "./input";
import { aggregateCartDetails, aggregateForOrder } from "./agg";
import Cart from "../cart.model";

export class GetCartLogic {
  constructor() {}

  async get(input: Input, language: string = "en") {
    const { user } = inputSchema.parse(input);

    let existingCart = await Cart.findOne({ user });
    if (!existingCart) {
      existingCart = await Cart.create({ user });
    }

    const cart = await Cart.aggregate([
      {
        $match: {
          user: user,
        },
      },
      ...aggregateCartDetails(language),
    ]);

    if (!cart.length) {
      return {
        user,
        products: [],
        totalPrice: 0,
        id: existingCart._id,
      };
    }
    return cart[0];
  }

  async getForOrder(input: Input) {
    const { user } = inputSchema.parse(input);

    let existingCart = await Cart.findOne({ user });
    if (!existingCart) {
      existingCart = await Cart.create({ user });
    }

    const cart = await Cart.aggregate([
      {
        $match: {
          user: user,
        },
      },
      ...aggregateForOrder(),
    ]);

    if (!cart.length) {
      return {
        user,
        products: [],
        totalPrice: 0,
        id: existingCart._id,
      };
    }

    return cart[0];
  }
}
