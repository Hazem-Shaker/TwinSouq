import InstallmentsOrder from "../../installmentsOrder/installmentsOrder.model";
import { Input, inputSchema } from "./input";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../shared/utils/custom-errors";

export class PayInstallmentsLogic {
  async execute(input: Input) {
    const { user, installmentsOrderId } = inputSchema.parse(input);

    const installmentsOder = await InstallmentsOrder.findOne({
      _id: installmentsOrderId,
      user,
    });

    if (!installmentsOder) {
      throw new NotFoundError("installments_order_not_found");
    }

    if (installmentsOder.status !== "approved") {
      throw new BadRequestError("installments_order_not_approved");
    }

    if (installmentsOder.donePayments === installmentsOder.numberOfMonths + 1) {
      throw new BadRequestError("order_paid");
    }

    if (installmentsOder.transactionId) {
      throw new BadRequestError("order_in_transaction");
    }

    throw new BadRequestError("online_payment_not_configured");
  }
}
