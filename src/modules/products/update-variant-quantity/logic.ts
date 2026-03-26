import { Input, inputSchema } from "./input";
import mongoose, { mongo } from "mongoose";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/utils/custom-errors";
import Variant from "../product-variants/variant.model";

export class UpdateVariantQuantityLogic {
  constructor() {}

  async decrease(input: Input, session: mongo.ClientSession) {
    input = inputSchema.parse(input);

    for (let item of input) {
      const variant = await Variant.findById(item.variant);
      if (!variant) {
        throw new NotFoundError("varaint_not_found");
      }

      if (item.quantity > variant.stock) {
        throw new ConflictError("out_of_stock");
      }

      variant.stock -= item.quantity;

      await variant.save({ session });
    }

    return true;
  }

  async rollback(input: Input) {
    input = inputSchema.parse(input);

    for (let item of input) {
      const variant = await Variant.findById(item.variant);
      if (!variant) {
        throw new NotFoundError("varaint_not_found");
      }

      variant.stock += item.quantity;

      await variant.save();
    }

    return true;
  }
}
