import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "./types";

const productSchema = new Schema<IProduct>(
  {
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: true,
    },
    archive: { type: Boolean, default: false },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    images: [{ type: mongoose.Types.ObjectId, ref: "File" }],
    notificationDays: {
      type: Number,
      required: true,
    },
    notificationHours: {
      type: Number,
      required: true,
    },
    paymentChoices: {
      type: String,
      enum: ["cash", "installements", "both"],
      required: true,
    },
    // options: {
    //   type: [
    //     {
    //       key: {
    //         type: String,
    //       },
    //       values: {
    //         type: [String],
    //       },
    //     },
    //   ],
    // },
    installmentOptions: {
      type: [
        {
          period: {
            type: Number,
            required: true,
          },
          profitPercantage: {
            type: Number,
            required: true,
          },
          upfrontPercentage: {
            type: Number,
            required: true,
          },
          contract: {
            type: mongoose.Types.ObjectId,
            ref: "File",
            required: true,
          },
        },
      ],
      default: [],
    },
    visible: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ price: 1 });

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    ret.id = ret._id;
    return ret;
  },
});

const Product: Model<IProduct> = mongoose.model("Product", productSchema);

export default Product;
