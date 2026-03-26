import mongoose, { Schema, Model } from "mongoose";
import { IPayout } from "./type";

const PayoutSchema: Schema<IPayout> = new Schema<IPayout>(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      required: true,
    },
    iban: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payout: Model<IPayout> = mongoose.model<IPayout>("Payout", PayoutSchema);

export default Payout;
