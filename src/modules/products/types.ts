import mongoose, { Document } from "mongoose";
export interface IProduct extends Document {
  provider: mongoose.Schema.Types.ObjectId;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  images: mongoose.Schema.Types.ObjectId[];
  notificationDays: number;
  notificationHours: number;
  archive: boolean;
  options: {
    key: string;
    values: string[];
  }[];
  installmentOptions: {
    _id: mongoose.Schema.Types.ObjectId;
    period: number;
    profitPercantage: number;
    upfrontPercentage: number;
    contract: mongoose.Schema.Types.ObjectId;
  }[];
  paymentChoices: "cash" | "installements" | "both";
  visible: boolean;
  views: number;
  salePrice: number | null;
  rating: number;
  reviewsCount: number;
}

export interface IVariant extends Document {
  product: mongoose.Schema.Types.ObjectId;
  images: mongoose.Schema.Types.ObjectId[];
  options: {
    key: string;
    value: string;
  }[];
  price: number | null;
  salePrice: number | null;
  optionsString: string;
  stock: number;
}
