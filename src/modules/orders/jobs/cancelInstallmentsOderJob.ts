import mongoose from "mongoose";

import InstallmentsOder from "../installmentsOrder/installmentsOrder.model";
import { PaymentService } from "../../payment/payment.service";

export const JOB_NAME = "CANCEL_INSTALLMENTS_ORDER";

export class CancelInstallmentsOrderJob {
  constructor(private paymentService: PaymentService) {}

  async cancelLogic(transaction: string) {
    const id = new mongoose.Types.ObjectId(transaction);

    const notProcessed = await this.paymentService.noRespondGateway(id);

    if (!notProcessed) {
      return;
    }

    const order = await InstallmentsOder.findOne({
      transactionId: id,
    });

    if (!order) {
      return;
    }

    await InstallmentsOder.updateOne(
      {
        transactionId: id,
      },
      { $unset: { transactionId: 1 } }
    );
  }
}
