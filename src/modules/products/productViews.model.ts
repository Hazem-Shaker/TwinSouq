import mongoose, { Schema, Model } from "mongoose";

interface ProductViews {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  views: number;
}

const productViewsSchema = new Schema<ProductViews>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

productViewsSchema.index({ product: 1, user: 1 }, { unique: true });

const ProductViews = mongoose.model("ProductViews", productViewsSchema);

export default ProductViews;
