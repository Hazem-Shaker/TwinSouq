import { Input, inputSchema } from "./input";
import { NotFoundError } from "../../../shared/utils/custom-errors";
import User from "../user.model";
import Provider from "../../providers/provider.model";
import Product from "../../products/product.model";

export class DeleteUserLogic {
  async execute(input: Input) {
    const { user } = inputSchema.parse(input);

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // If user is a provider, delete associated provider data
    if (existingUser.roles.includes("provider")) {
      const provider = await Provider.findOne({ user: user });
      if (provider) {
        // Delete all products associated with the provider
        await Product.deleteMany({ provider: provider._id });
        // Delete the provider
        await Provider.deleteOne({ _id: provider._id });
      }
    }

    // Delete the  user
    await User.deleteOne({ _id: user });

    return null;
  }
}
