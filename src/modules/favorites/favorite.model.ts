import mongoose, { Schema, Model } from "mongoose";
import { IFavorite } from "./types";

const favoriteSchema: Schema = new Schema<IFavorite>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["product"],
  },
});

favoriteSchema.index({ user: 1, item: 1 });
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ item: 1 });

const Favorite: Model<IFavorite> = mongoose.model<IFavorite>(
  "Favorite",
  favoriteSchema
);

export default Favorite;
