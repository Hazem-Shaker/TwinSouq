import mongoose, { Document } from "mongoose";

export interface IInstallmentsOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  provider: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  variant: mongoose.Schema.Types.ObjectId;
  address: mongoose.Schema.Types.ObjectId;
  status: "sent" | "approved" | "rejected"; // changes by admin
  paymentStatus: "first-payment" | "late-payment" | "next-payment" | "done"; // changes by user payments
  shippingStatus: "pending" | "shipped" | "delivered"; // changes by admin after the first payment
  name_en: string;
  name_ar: string;
  profitPercent: number;
  price: number;
  initialPayment: number;
  eachPayment: number;
  numberOfMonths: number;
  donePayments: number;
  paidAmount: number;
  accountStatement: mongoose.Schema.Types.ObjectId;
  salaryCertificate: mongoose.Schema.Types.ObjectId;
  contract: mongoose.Schema.Types.ObjectId;
  iban: string;
  nextPayment?: {
    amount: number;
    date: Date;
  };
  paidInstallments: {
    order: number;
    amount: number;
    date: Date;
    status: "pending" | "paid";
    transactionId: mongoose.Schema.Types.ObjectId;
  }[];
  transactionId?: mongoose.Schema.Types.ObjectId;
  dueDate?: Date;
}
