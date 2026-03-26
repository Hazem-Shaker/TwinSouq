import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import { EarningService } from "../../../earnings/earning.service";
import {
  NotFoundError,
  ConflictError,
} from "../../../../shared/utils/custom-errors";

import { inputSchema, Input } from "./input";
import mongoose from "mongoose";
export class UpdateInstallmentsOrderStatusLogic {
  constructor(private earningService: EarningService) {}

  async update(input: Input, language: string = "en") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { orderId, shippingStatus } = inputSchema.parse(input);

      const order = await InstallmentsOrder.findById(orderId);
      if (!order) {
        throw new NotFoundError("order_not_found");
      }
      if (order.shippingStatus === "delivered") {
        throw new ConflictError("order_already_delivered");
      }
      if (shippingStatus === "delivered") {
        for (const installment of order.paidInstallments) {
          const profitAmount = (order.price * order.profitPercent) / 100.0;
          await this.earningService.createInstallmentEarning(
            {
              provider: order.provider,
              amount: installment.amount - profitAmount,
              order: orderId,
              product: {
                id: order.product,
                variant: order.variant,
                price: order.price,
                profitPercent: order.profitPercent,
              },
              status: "pending",
            },
            session
          );
        }
      }
      await InstallmentsOrder.findByIdAndUpdate(
        orderId,
        { shippingStatus },
        { new: true }
      );
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
