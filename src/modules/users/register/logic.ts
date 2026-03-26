import bcrypt from "bcrypt";
import { inputSchema, Input } from "./input";
import User from "../user.model";
import { config } from "../../../shared/config";
import { generateOtp } from "../../../shared/utils/otp";
import { MailerService } from "../../../shared/utils/email-system/mailer";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { IUserResponseData } from "../types";

export class RegisterLogic {
  mailerService: MailerService;

  constructor(mailerService: MailerService) {
    this.mailerService = mailerService;
  }

  parseInput(data: Input) {
    data = inputSchema.parse(data);
    const parsedData: Omit<Input, "role"> &
      Partial<Pick<Input, "role">> & { roles: string[] } = {
      ...data,
      roles: ["user"],
    };

    if (data.role === "provider") {
      parsedData.roles.push("provider");
    }

    delete parsedData.role;
    return parsedData;
  }

  async registerUser(input: Input, language: string = "en") {
    // Check if the email already exists
    const data = this.parseInput(input);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new InvalidCredentialsError("emailInUse"); // Use error key
    }

    const existingPhone = await User.findOne({ phone: data.phone });
    if (existingPhone) {
      throw new InvalidCredentialsError("phoneInUse"); // Use error key
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.bcrypt.saltRounds
    );

    data.password = hashedPassword;

    // Create a new user
    const otpCode = generateOtp(); // Generate an OTP
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    const newUser = await User.create({
      ...data,
      otp: { code: otpCode, expiry: otpExpiry },
    });

    // Send the OTP to the user's email
    await this.mailerService.sendOtpEmail(newUser.email, otpCode);

    const userData: IUserResponseData = newUser.toObject();

    delete userData.password;
    delete userData.__v;
    delete userData.otp;

    return userData;
  }
}
