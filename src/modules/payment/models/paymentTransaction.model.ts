import mongoose, { Schema, Model } from "mongoose";
import { IPaymentTransaction } from "../interfaces";

const PaymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transactionType: {
      type: String,
      enum: ["charge", "refund", "payout"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "no-respond"],
      required: true,
    },
    gateway: {
      type: String,
      enum: ["hyperpay", "stripe", "paypal", "bank_transfer"],
      required: true,
    },
    transactionId: { type: String },
    paymentDetails: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const PaymentTransaction: Model<IPaymentTransaction> =
  mongoose.model<IPaymentTransaction>(
    "PaymentTransaction",
    PaymentTransactionSchema
  );
