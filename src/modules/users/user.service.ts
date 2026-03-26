import { RegisterLogic } from "./register";
import { VerifyLogic } from "./verify";
import { LoginLogic } from "./login";
import { MailerService } from "../../shared/utils/email-system/mailer";
import { UpdatePasswordLogic } from "./update-password";
import { GetUserLogic } from "./get";
import { ResetPasswordLogic } from "./reset-password";
import { BeProviderLogic } from "./be-provider";
import { UpdateUserDataLogic } from "./update-user-data";
import { DeleteUserLogic } from "./delete-user";

export class UserService {
  registerLogic: RegisterLogic;
  mailerService: MailerService;
  verifyLogic: VerifyLogic;
  loginLogic: LoginLogic;
  updatePasswordLogic: UpdatePasswordLogic;
  getUserLogic: GetUserLogic;
  resetPasswordLogic: ResetPasswordLogic;
  beProviderLogic: BeProviderLogic;
  updateUserDataLogic: UpdateUserDataLogic;
  deleteUserLogic: DeleteUserLogic;
  constructor(mailerService: MailerService) {
    this.mailerService = mailerService;
    this.registerLogic = new RegisterLogic(this.mailerService);
    this.verifyLogic = new VerifyLogic(this.mailerService);
    this.loginLogic = new LoginLogic(this.verifyLogic);
    this.updatePasswordLogic = new UpdatePasswordLogic(this.mailerService);
    this.getUserLogic = new GetUserLogic();
    this.resetPasswordLogic = new ResetPasswordLogic(this.mailerService);
    this.beProviderLogic = new BeProviderLogic();
    this.updateUserDataLogic = new UpdateUserDataLogic();
    this.deleteUserLogic = new DeleteUserLogic();
  }

  register(data: any, language: string) {
    console.log(data);
    return this.registerLogic.registerUser(data, language);
  }

  verify(data: any, language: string) {
    return this.verifyLogic.verifyUser(data, language);
  }

  resendOtp(data: any, language: string) {
    return this.verifyLogic.resendOtp(data, language);
  }

  login(data: any) {
    return this.loginLogic.login(data);
  }

  updatePassword(data: any, userId: any, language: string) {
    return this.updatePasswordLogic.updatePassword({ data, userId }, language);
  }

  getUser(userId: any, language: string) {
    return this.getUserLogic.getUser({ userId }, language);
  }

  requestPasswordReset(email: string, language: string) {
    return this.resetPasswordLogic.resetRequest({ email }, language);
  }

  verifyResetPasswordOtp(data: any, language: string) {
    return this.resetPasswordLogic.resetPasswordOtpVerify(data, language);
  }

  resetPassword(data: any, language: string) {
    return this.resetPasswordLogic.resetPassword(data, language);
  }

  beProvider(id: string, language: string) {
    return this.beProviderLogic.beProvider(id, language);
  }

  updateUserData(user: any, data: any, language: string) {
    return this.updateUserDataLogic.execute({ user, data });
  }

  deleteUser(user: any) {
    return this.deleteUserLogic.execute({ user });
  }
}
