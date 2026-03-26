import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
  title: string;
  owner: mongoose.Schema.Types.ObjectId;
  name: string;
  country: string;
  city: string;
  streetAddress: string;
  zipCode: string;
}
