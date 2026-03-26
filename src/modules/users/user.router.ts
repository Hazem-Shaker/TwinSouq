import { UserContoller } from "./user.controller";
import { UserService } from "./user.service";
import { Router } from "express";
import { UserAuthMiddleware } from "../../shared/middlewares/auth";
import {
  upload,
  processImagesMiddleware,
} from "../../shared/middlewares/upload";

export class UserRouter {
  private userController: UserContoller;
  private userService: UserService;
  userAuthMiddleware: UserAuthMiddleware;

  constructor(userService: UserService) {
    this.userService = userService;
    console.log(this.userService.register);
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.userController = new UserContoller(this.userService);
  }

  createRouter() {
    const router = Router();

    router.post(
      "/register",
      upload.any(),
      this.userController.createUser.bind(this.userController)
    );

    router.post(
      "/verify",
      upload.any(),
      this.userController.verifyUser.bind(this.userController)
    );

    router.post(
      "/resend-otp",
      upload.any(),
      this.userController.resendOtp.bind(this.userController)
    );

    router.post(
      "/login",
      upload.any(),
      this.userController.login.bind(this.userController)
    );

    router.post(
      "/update-password",
      upload.any(),
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.updatePassword.bind(this.userController)
    );

    router.post(
      "/request-password-reset",
      upload.any(),
      this.userController.requestPasswordReset.bind(this.userController)
    );

    router.post(
      "/verify-reset-password-otp",
      upload.any(),
      this.userController.verifyResetPasswordOtp.bind(this.userController)
    );

    router.post(
      "/reset-password",
      upload.any(),
      this.userController.resetPassword.bind(this.userController)
    );

    router.put(
      "/be-provider",
      upload.any(),
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.beProvider.bind(this.userController)
    );

    router.put(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      upload.fields([
        {
          name: "photo",
          maxCount: 1,
        },
      ]),
      processImagesMiddleware(["photo"]),
      this.userController.updateUserData.bind(this.userController)
    );

    router.delete(
      "/",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.deleteUser.bind(this.userController)
    );

    return router;
  }
}
