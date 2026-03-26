import mongoose, { Schema, Model } from "mongoose";
import { ITransaction } from "../interfaces";

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId }, // Optional for payments
    orderIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transactionType: {
      type: String,
      enum: ["charge", "refund", "payout"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
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

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
