import mongoose from "mongoose";

import Order from "../order.model";
import { CartService } from "../../carts/cart.service";
import { ProductService } from "../../products/product.service";
import { PaymentService } from "../../payment/payment.service";

export const JOB_NAME = "ORDERS_NO_PAYMENT_RESPONSE";
export class CancelOrderJob {
  constructor(
    public cartService: CartService,
    public productService: ProductService,
    public paymentService: PaymentService
  ) {}
  async cancelLogic(transaction: string) {
    const id = new mongoose.Types.ObjectId(transaction);

    const notProcessed = await this.paymentService.noRespondGateway(id);

    if (!notProcessed) {
      return;
    }

    const orders = await Order.find({
      transaction: id,
    });

    const variantIds: {
      variant: mongoose.Schema.Types.ObjectId;
      quantity: number;
    }[] = [];

    for (let order of orders) {
      for (let product of order.products) {
        variantIds.push({
          variant: product.variant,
          quantity: product.quantity,
        });
      }
    }

    await this.cartService.makeCartFree(orders[0]?.user);

    await this.productService.rollbackStock(variantIds);

    await Order.updateMany(
      {
        transaction,
      },
      {
        paymentStatus: "failed",
      }
    );
  }
}
