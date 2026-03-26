import bcrypt from "bcrypt";
import { inputSchema, Input } from "./input";
import User from "../user.model";
import { config } from "../../../shared/config";
import { MailerService } from "../../../shared/utils/email-system/mailer";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { IUserResponseData } from "../types";

export class UpdatePasswordLogic {
  mailerService: MailerService;

  constructor(mailerService: MailerService) {
    this.mailerService = mailerService;
  }

  async updatePassword({ data, userId }: Input, language: string = "en") {
    const parsedData = inputSchema.parse({ data, userId });

    data = parsedData.data;
    userId = parsedData.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Use error key
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError("invalidPassword"); // Use error key
    }

    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      config.bcrypt.saltRounds
    );

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    const userData: IUserResponseData = user.toObject();

    // Remove sensitive or unnecessary fields
    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    userData.id = user._id;

    return userData;
  }
}
