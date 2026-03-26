import mongoose, { Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  item: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
  itemType: "product";
}
