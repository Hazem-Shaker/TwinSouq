import { inputSchema, Input } from "./input";
import User from "../user.model";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { IUserResponseData } from "../types";

export class GetUserLogic {
  async getUser({ userId }: Input, language: string = "en") {
    const parsedData = inputSchema.parse({ userId });

    userId = parsedData.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Use error key
    }

    const userObj: IUserResponseData = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    delete userObj.otp;

    return userObj;
  }
}
