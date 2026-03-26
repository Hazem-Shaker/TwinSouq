import mongoose, { Document } from "mongoose";

export interface IEarnings extends Document {
  provider: mongoose.Types.ObjectId;
  type: "order" | "installment";
  order?: mongoose.Types.ObjectId;
  product?: {
    id: mongoose.Types.ObjectId;
    variant: mongoose.Types.ObjectId;
    price: number;
    quantity: number;
    profitPercent: number;
  };
  amount: number;
  status: "pending" | "available" | "withdrawn";
  withdrawRequest?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProviderBalance extends Document {
  provider: mongoose.Types.ObjectId;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayout extends Document {
  provider: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "paid";
  iban: string;
  createdAt: Date;
  updatedAt: Date;
}
