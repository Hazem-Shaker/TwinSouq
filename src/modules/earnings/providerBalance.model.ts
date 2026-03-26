import mongoose, { Schema, Model } from "mongoose";
import { IProviderBalance } from "./type";

const providerBalanceSchema: Schema = new Schema<IProviderBalance>(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      unique: true,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    pendingBalance: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

providerBalanceSchema.index({ provider: 1 });

const ProviderBalance: Model<IProviderBalance> =
  mongoose.model<IProviderBalance>("ProviderBalance", providerBalanceSchema);

export default ProviderBalance;
