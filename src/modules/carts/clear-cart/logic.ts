import Cart from "../cart.model";
import { Input, inputSchema } from "./input";

export class ClearCartLogic {
  constructor() {}

  async clear(input: Input) {
    const cart = await Cart.findOneAndDelete({ user: input.user });
    return cart;
  }
}
