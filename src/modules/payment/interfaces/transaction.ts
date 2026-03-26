import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Schema.Types.ObjectId; // For customer payments
  orderIds: mongoose.Schema.Types.ObjectId[];
  amount: number;
  currency: string;
  transactionType: "charge" | "refund" | "payout"; // Different transaction types
  status: "pending" | "completed" | "failed"; // Transaction status
  gateway: "hyperpay" | "stripe" | "paypal" | "bank_transfer"; // Payment gateway
  transactionId?: string; // The actual transaction ID from the gateway
  paymentDetails: Record<string, any>; // Flexible field for storing gateway-specific data
  createdAt: Date;
  updatedAt: Date;
}
