import mongoose from "mongoose";
import { PaymentTransaction } from "./models/paymentTransaction.model";

export class PaymentService {
  constructor() {}

  async noRespondGateway(id: mongoose.Types.ObjectId) {
    const transaction = await PaymentTransaction.findById(id);

    if (!transaction) {
      return false;
    }

    if (transaction.status !== "pending") {
      return false;
    }

    transaction.status = "no-respond";

    await transaction.save();
    return true;
  }
}
