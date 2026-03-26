import { Input, inputSchema } from "./input";
import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import {
  BadRequestError,
  NoRouteFound,
} from "../../../../shared/utils/custom-errors";
import { ProductService } from "../../../products/product.service";
export class CancelInstallmentsOrderLogic {
  constructor(private readonly productService: ProductService) {}
  async execute(input: Input) {
    const { id, provider } = inputSchema.parse(input);

    const order = await InstallmentsOrder.findById(id);

    if (!order || order.provider.toString() !== provider.toString()) {
      throw new NoRouteFound("order_not_found");
    }

    if (order.donePayments !== 0) {
      throw new BadRequestError("cant_cancel_order");
    }

    if (order.status !== "approved") {
      throw new BadRequestError("order_not_approved");
    }

    const session = await InstallmentsOrder.startSession();

    try {
      await session.withTransaction(async () => {
        await this.productService.rollbackStock([
          { variant: order.variant, quantity: 1 },
        ]);

        order.status = "rejected";
        await order.save({ session });
      });
    } finally {
      await session.endSession();
    }

    return null;
  }
}
