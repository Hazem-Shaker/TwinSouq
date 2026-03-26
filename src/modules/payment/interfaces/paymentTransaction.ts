import mongoose, { Document } from "mongoose";

export interface IPaymentTransaction extends Document {
  paymentId: string;
  status: "pending" | "completed" | "failed" | "no-respond";
  amount: number;
  currency: string;
  transactionType: "charge" | "refund" | "payout"; // Different transaction types
  gateway: "hyperpay" | "stripe" | "paypal" | "bank_transfer"; // Payment gateway
  transactionId?: string; // The actual transaction ID from the gateway
  paymentDetails: Record<string, any>; // Flexible field for storing gateway-specific data
  createdAt: Date;
  updatedAt: Date;
}
