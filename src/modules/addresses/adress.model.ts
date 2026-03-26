import mongoose, { Model, Schema } from "mongoose";
import { IAddress } from "./type";

const addressSchema: Schema = new Schema<IAddress>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

addressSchema.index({ owner: 1 });

const Address: Model<IAddress> = mongoose.model<IAddress>(
  "Address",
  addressSchema
);

export default Address;
