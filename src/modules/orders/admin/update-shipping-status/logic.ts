import Order from "../../order.model";
import { EarningService } from "../../../earnings/earning.service";
import {
  NotFoundError,
  ConflictError,
} from "../../../../shared/utils/custom-errors";

import { inputSchema, Input } from "./input";
import mongoose from "mongoose";
export class UpdateShippingStatusLogic {
  constructor(private earningService: EarningService) {}

  async update(input: Input, language: string = "en") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { orderId, shippingStatus } = inputSchema.parse(input);

      const order = await Order.findById(orderId);
      if (!order) {
        throw new NotFoundError("order_not_found");
      }
      if (order.shippingStatus === "delivered") {
        throw new ConflictError("order_already_delivered");
      }
      if (shippingStatus === "delivered") {
        for (const product of order.products) {
          console.log(product);
          const profitAmount = (product.price * product.profitPercent) / 100.0;
          await this.earningService.createOrderEarning(
            {
              provider: product.provider,
              amount: (product.price - profitAmount) * product.quantity,
              order: orderId,
              product: {
                id: product.id,
                variant: product.variant,
                price: product.price,
                quantity: product.quantity,
                profitPercent: product.profitPercent,
              },
              status: "pending",
            },
            session
          );
        }
      }
      await Order.findByIdAndUpdate(orderId, { shippingStatus }, { new: true });
      await session.commitTransaction();
      return null;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
