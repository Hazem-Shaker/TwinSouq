import mongoose, { Document } from "mongoose";

export interface ICartItem {
  id: mongoose.Schema.Types.ObjectId;
  variant: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: mongoose.Schema.Types.ObjectId;
  products: ICartItem[];
  status: "in-transaction" | "free";
}
