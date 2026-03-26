import mongoose, { Schema, Model } from "mongoose";
import { IAdmin } from "./types";

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
