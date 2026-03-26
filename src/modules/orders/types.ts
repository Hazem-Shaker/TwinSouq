import mongoose, { Document } from "mongoose";

export interface IOrderItem {
  id: mongoose.Schema.Types.ObjectId;
  variant: mongoose.Schema.Types.ObjectId;
  provider: mongoose.Schema.Types.ObjectId;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  salePrice: number | null;
  image: { url: string };
  options: {
    name_ar: string;
    name_en: string;
    value_ar: string;
    value_en: string;
  }[];
  profitPercent: number;
  salePercent: number | null;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  provider: mongoose.Schema.Types.ObjectId;
  products: IOrderItem[];
  price: number;
  shippingPrice: number;
  shippingStatus: "pending" | "shipped" | "delivered";
  paymentStatus: "pending" | "failed" | "paid";
  address: mongoose.Schema.Types.ObjectId;
  transaction: mongoose.Schema.Types.ObjectId;
}

export interface IOrderArray {
  user: mongoose.Schema.Types.ObjectId;
  provider: mongoose.Schema.Types.ObjectId;
  products: IOrderItem[];
  price: number;
  shippingPrice: number;
}
