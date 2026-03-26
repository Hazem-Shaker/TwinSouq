import mongoose, { Schema } from "mongoose";
import { IEarnings } from "./type";

const earningSchema = new Schema<IEarnings>(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["order", "installment"],
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    product: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      profitPercent: {
        type: Number,
        required: true,
      },
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "available", "withdrawn"],
      required: true,
    },
    withdrawRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WithdrawRequest",
      default: null,
    },
  },
  { timestamps: true }
);

const Earning = mongoose.model<IEarnings>("Earning", earningSchema);

export default Earning;
