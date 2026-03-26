import mongoose, { Model, Schema } from "mongoose";
import { ICart } from "./type";

const cartSchema: Schema<ICart> = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    products: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
          },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["in-transaction", "free"],
      default: "free",
    },
  },
  { timestamps: true }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
