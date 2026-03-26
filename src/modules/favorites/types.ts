import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Schema.Types.ObjectId;
  item: mongoose.Schema.Types.ObjectId;
  itemType: "product";
}
