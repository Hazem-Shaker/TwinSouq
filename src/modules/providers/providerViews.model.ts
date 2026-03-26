import mongoose, { Schema, model } from "mongoose";

interface ProviderViews {
  provider: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  views: number;
}

const providerViewsSchema = new Schema<ProviderViews>({
  provider: { type: Schema.Types.ObjectId, ref: "Provider" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

providerViewsSchema.index({ provider: 1, user: 1 }, { unique: true });

const ProviderViews = model("ProviderViews", providerViewsSchema);

export default ProviderViews;
