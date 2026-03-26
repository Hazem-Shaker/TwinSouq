import mongoose, { Schema, Model } from "mongoose";
import { IOrder } from "./types";

const orderSchema: Schema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
          },
          variant: {
            type: mongoose.Schema.Types.ObjectId,
          },
          provider: {
            type: mongoose.Schema.Types.ObjectId,
          },
          name_ar: {
            type: String,
          },
          name_en: {
            type: String,
          },
          description_ar: {
            type: String,
          },
          description_en: {
            type: String,
          },
          price: {
            type: Number,
          },
          salePrice: {
            type: Number,
          },
          salePercent: {
            type: Number,
          },
          image: {
            url: {
              type: String,
            },
          },
          quantity: {
            type: Number,
          },
          profitPercent: {
            type: Number,
          },
          options: {
            type: [
              {
                name_ar: {
                  type: String,
                },
                name_en: {
                  type: String,
                },
                value_ar: {
                  type: String,
                },
                value_en: {
                  type: String,
                },
              },
            ],
          },
        },
      ],
      default: [],
    },
    price: {
      type: Number,
    },
    shippingPrice: {
      type: Number,
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ provider: 1 });
orderSchema.index({ provider: 1, status: 1 });
orderSchema.index({ user: 1, provider: 1 });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
