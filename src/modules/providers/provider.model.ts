import mongoose, { Schema, Model } from "mongoose";
import { IProvider } from "./types";

const providerSchema = new Schema<IProvider>({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  iban: { type: String, required: true },
  address: { type: String, required: true },
  idNumber: { type: String, required: true },
  idImage: {
    front: { type: mongoose.Types.ObjectId, ref: "File", required: true },
    back: { type: mongoose.Types.ObjectId, ref: "File", required: true },
  },
  views: { type: Number, default: 0 },
  birthdate: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  photo: { type: mongoose.Types.ObjectId, ref: "File", required: true },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
});

const Provider: Model<IProvider> = mongoose.model<IProvider>(
  "Provider",
  providerSchema
);

export default Provider;
