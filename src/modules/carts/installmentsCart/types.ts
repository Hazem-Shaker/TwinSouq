import mongoose, { Document } from "mongoose";

export interface IInstallmentsCart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: {
    product: mongoose.Schema.Types.ObjectId;
    variant: mongoose.Schema.Types.ObjectId;
    installmentOption: mongoose.Schema.Types.ObjectId;
  }[];
}
