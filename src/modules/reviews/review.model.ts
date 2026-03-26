import mongoose, { Model, Schema } from "mongoose";
import { IReview } from "./type";

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      default: null,
    },
    itemType: {
      type: String,
      enum: ["product"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ item: 1 });
reviewSchema.index({ item: 1, user: 1 });

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
