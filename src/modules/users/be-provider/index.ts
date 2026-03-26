import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import User from "../user.model";
import { IUserResponseData } from "../types";

export class BeProviderLogic {
  constructor() {}

  async beProvider(id: string, language: string = "en") {
    const user = await User.findById(id);
    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Use error key
    }

    if (user.roles.includes("provider")) {
      throw new InvalidCredentialsError("alreadyProvider"); // Use error key
    }

    user.roles.push("provider");
    await user.save();
    const userData: IUserResponseData = user.toObject();

    // Remove sensitive or unnecessary fields
    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    userData.id = user._id;

    return userData;
  }
}
