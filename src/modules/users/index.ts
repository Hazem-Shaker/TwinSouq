import { UserService } from "./user.service";
import { UserRouter } from "./user.router";
import { MailerService } from "../../shared/utils/email-system/mailer";

export class UserModule {
  userService: UserService;
  userRouter: UserRouter;

  constructor(mailerService: MailerService) {
    this.userService = new UserService(mailerService);
    this.userRouter = new UserRouter(this.userService);
  }

  routerFactory() {
    return this.userRouter.createRouter();
  }
}
