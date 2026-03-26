import User from "../user.model";
import {
  OtpVerifyInput,
  RequestResetPasswordInput,
  requestResetPasswordInputSchema,
  otpVerifyInputSchema,
  ResetPasswordInput,
  resetPasswordInputSchema,
} from "./input";
import { MailerService } from "../../../shared/utils/email-system/mailer";
import { generateOtp } from "../../../shared/utils/otp";
import {
  generateTempToken,
  validateTempToken,
  deleteTempToken,
} from "../../../shared/utils/auth/tempTokenUtils";
import bcrypt from "bcrypt";
import { config } from "../../../shared/config";
import {
  InvalidCredentialsError,
  NotFoundError,
} from "../../../shared/utils/custom-errors";

export class ResetPasswordLogic {
  mailerService: MailerService;

  constructor(mailerService: MailerService) {
    this.mailerService = mailerService;
  }

  async resetRequest(
    { email }: RequestResetPasswordInput,
    language: string = "en"
  ) {
    const parsedData = requestResetPasswordInputSchema.parse({ email });
    email = parsedData.email;

    const user = await User.findOne({ $or: [{ email }, { phone: email }] });

    if (!user) {
      throw new NotFoundError("userNotFound"); // Throw error with key
    }

    const otpCode = generateOtp();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.otp = { code: otpCode, expiry: otpExpiry };
    await user.save();

    await this.mailerService.sendOtpEmail(user.email, otpCode);

    return null;
  }

  async resetPasswordOtpVerify(
    { email, otp }: OtpVerifyInput,
    language: string = "en"
  ) {
    const parsedData = otpVerifyInputSchema.parse({ email, otp });
    email = parsedData.email;
    otp = parsedData.otp;

    const user = await User.findOne({ $or: [{ email }, { phone: email }] });

    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Throw error with key
    }

    if (!user.otp) {
      throw new InvalidCredentialsError("otpNotGenerated"); // Throw error with key
    }

    if (user.otp.expiry < new Date()) {
      throw new InvalidCredentialsError("otpExpired"); // Throw error with key
    }

    if (user.otp.code !== otp) {
      throw new InvalidCredentialsError("invalidOtp"); // Throw error with key
    }

    user.otp = undefined;
    await user.save();

    const tempToken = await generateTempToken(user._id, user.email);

    return { token: tempToken };
  }

  async resetPassword(
    { password, token }: ResetPasswordInput,
    language: string = "en"
  ) {
    const parsedData = resetPasswordInputSchema.parse({ password, token });
    password = parsedData.password;
    token = parsedData.token;

    const data = await validateTempToken(token);

    if (!data) {
      throw new InvalidCredentialsError("invalidToken"); // Throw error with key
    }

    const user = await User.findById(data.id);

    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Throw error with key
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds
    );

    user.password = hashedPassword;
    await user.save();

    await deleteTempToken(token);

    return null;
  }
}
