import mongoose, { Model, Schema } from "mongoose";
import { IInstallmentsCart } from "./types";

const installmentsCartSchema: Schema<IInstallmentsCart> =
  new Schema<IInstallmentsCart>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
        },
        installmentOption: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
  });

installmentsCartSchema.index({ user: 1 });

const InstallmentsCart: Model<IInstallmentsCart> =
  mongoose.model<IInstallmentsCart>("InstallmentsCart", installmentsCartSchema);

export default InstallmentsCart;
