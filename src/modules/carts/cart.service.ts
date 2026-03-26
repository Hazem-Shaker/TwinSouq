import mongoose, { ClientSession } from "mongoose";
import Cart from "./cart.model";
import { ProductService } from "../products/product.service";
import { AddProductLogic } from "./add-product";
import { GetCartLogic } from "./get";
import { ClearCartLogic } from "./clear-cart";
import { ConflictError } from "../../shared/utils/custom-errors";
import { NotFoundError } from "../../shared/utils/custom-errors";

export class CartService {
  private addProductLogic: AddProductLogic;
  private getCartLogic: GetCartLogic;
  private clearCartLogic: ClearCartLogic;
  constructor(public productService: ProductService) {
    this.addProductLogic = new AddProductLogic(this.productService);
    this.getCartLogic = new GetCartLogic();
    this.clearCartLogic = new ClearCartLogic();
  }

  addProductToCart(user: any, data: any, language: string) {
    return this.addProductLogic.update({ user, ...data }, language);
  }

  getCart(user: any, language: string) {
    return this.getCartLogic.get({ user }, language);
  }

  getCartForOrder(user: any) {
    return this.getCartLogic.getForOrder({ user });
  }

  clearCart(user: any) {
    return this.clearCartLogic.clear({ user });
  }

  async makeCartBusy(
    id: mongoose.Schema.Types.ObjectId,
    session: ClientSession
  ) {
    const cart = await Cart.findById(id);

    if (!cart) {
      throw new NotFoundError("no_data");
    }

    if (cart.status !== "free") {
      throw new ConflictError("cart_is_not_free");
    }
    cart.status = "in-transaction";
    await cart.save({ session });
  }

  async makeCartFree(id: mongoose.Schema.Types.ObjectId) {
    if (!id) return;
    const cart = await Cart.findOne({ user: id });

    if (!cart) {
      throw new NotFoundError("no_data");
    }

    cart.status = "free";
    await cart.save();
  }
}
