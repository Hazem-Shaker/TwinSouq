import {
  ResendOtpInput,
  veirfyInputSchema,
  VerifyInput,
  resendOtpInputSchema,
} from "./input";
import User from "../user.model";
import { IUserResponseData } from "../types";
import { MailerService } from "../../../shared/utils/email-system/mailer";
import { generateOtp } from "../../../shared/utils/otp";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { generateToken } from "../../../shared/utils/auth/tokenUtils";

export class VerifyLogic {
  mailerService: MailerService;

  constructor(mailerService: MailerService) {
    this.mailerService = mailerService;
  }

  async verifyUser(data: VerifyInput, language: string = "en") {
    data = veirfyInputSchema.parse(data);
    const { otp, email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Use error key
    }
    if (!user.otp) {
      throw new InvalidCredentialsError("otpNotGenerated"); // Use error key
    }

    if (user.otp.code !== otp) {
      throw new InvalidCredentialsError("invalidOtp"); // Use error key
    }

    if (user.otp.expiry < new Date()) {
      throw new InvalidCredentialsError("otpExpired"); // Use error key
    }

    user.isVerified = true;
    await user.save();

    await this.mailerService.sendWelcomeEmail(user.email, user.name);

    // Convert user document to a plain object
    const userData: IUserResponseData = user.toObject();

    // Remove sensitive or unnecessary fields
    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    // Add `id` field to the response
    userData.id = user._id;

    // Generate a token
    const token = await generateToken(user._id);

    return {
      token: token,
      user: userData,
    };
  }

  async resendOtp(data: ResendOtpInput, language: string = "en") {
    data = resendOtpInputSchema.parse(data);
    const user = await User.findOne({
      email: data.email,
    });

    if (!user) {
      throw new InvalidCredentialsError("userNotFound"); // Use error key
    }

    if (user.isVerified) {
      throw new InvalidCredentialsError("alreadyVerified"); // Use error key
    }

    const otpCode = generateOtp(); // Generate an OTP
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.otp = { code: otpCode, expiry: otpExpiry };
    await user.save();

    await this.mailerService.sendOtpEmail(user.email, otpCode);

    const userData: IUserResponseData = user.toObject();

    // Remove sensitive or unnecessary fields
    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    // Add `id` field to the response
    userData.id = user._id;
    return userData;
  }
}
