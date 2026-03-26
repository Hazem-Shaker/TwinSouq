import bcrypt from "bcrypt";
import User from "../user.model";
import { VerifyLogic } from "../verify";
import { inputSchema, Input } from "./input";
import { IUserResponseData } from "../types";
import { generateToken } from "../../../shared/utils/auth/tokenUtils";
import {
  InvalidCredentialsError,
  NotFoundError,
  UnauthorizedError,
  UnverifiedAccount,
} from "../../../shared/utils/custom-errors";

export class LoginLogic {
  verifyLogic: VerifyLogic;
  constructor(verifyLogic: VerifyLogic) {
    this.verifyLogic = verifyLogic;
  }

  async login(data: Input, language: string = "en") {
    data = inputSchema.parse(data);
    const { email, password, role } = data;

    const user = await User.findOne({
      $or: [{ email }, { phone: email }],
    });

    if (!user) {
      throw new NotFoundError("userNotRegistered"); // Use error key
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new InvalidCredentialsError("wrongPassword"); // Use error key
    }

    const userData: IUserResponseData = user.toObject();

    // Remove sensitive or unnecessary fields
    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    if (user.isVerified === false) {
      await this.verifyLogic.resendOtp({ email: user.email });
      return {
        user: userData,
      };
    }

    if (!user.roles.includes(role)) {
      throw new UnauthorizedError("userNotAllowed");
    }

    // Add `id` field to the response
    userData.id = user._id;

    // Generate a token
    const token = await generateToken(user._id);

    return {
      token: token,
      user: userData,
    };
  }
}
