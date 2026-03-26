import mongoose from "mongoose";
import { Input, inputSchema } from "./input";
import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import {
  BadRequestError,
  NoRouteFound,
  UnauthorizedError,
} from "../../../../shared/utils/custom-errors";
import { ProductService } from "../../../products/product.service";
export class InstallmentsOrderUpdateLogic {
  constructor(private productService: ProductService) {}

  async update(input: Input, language: string = "en") {
    const { id, status, provider } = inputSchema.parse(input);

    const order = await InstallmentsOrder.findById(id);
    if (!order) {
      throw new NoRouteFound("order_not_found");
    }

    if (order.provider.toString() !== provider.toString()) {
      throw new UnauthorizedError("unauthorized");
    }

    if (order.status !== "sent") {
      throw new BadRequestError("order_already_updated");
    }

    if (status === "approved") {
      const success = await this.decreaseStock(order.variant);
      if (!success) {
        order.status = "rejected";
        await order.save();
        throw new BadRequestError("out_of_stock");
      }
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      order.nextPayment = {
        amount: order.initialPayment,
        date: dueDate,
      };
      order.dueDate = dueDate;
    }

    await order.save();
    order.status = status;
    await order.save();

    return order;
  }

  private async decreaseStock(variant: mongoose.Schema.Types.ObjectId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.productService.decreaseStock(
        [{ variant, quantity: 1 }],
        session
      );
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      return false;
    } finally {
      await session.endSession();
    }
  }
}
