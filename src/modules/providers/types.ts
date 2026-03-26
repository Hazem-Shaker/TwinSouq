import mongoose, { Document } from "mongoose";

export interface IProvider extends Document {
  user: mongoose.Schema.Types.ObjectId;
  iban: string;
  idNumber: string;
  address: string;
  idImage: {
    front: mongoose.Schema.Types.ObjectId;
    back: mongoose.Schema.Types.ObjectId;
  };
  views: number;
  birthdate: Date;
  gender: "male" | "female";
  rating: number;
  reviewsCount: number;
  photo: mongoose.Schema.Types.ObjectId;
  isVerified: boolean;
}
