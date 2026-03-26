import { UserService } from "./user.service";
import { Request, Response, NextFunction } from "express";

export class UserContoller {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    try {
      const response = await this.userService.register(req.body, req.language);
      res.sendSuccess(req.t("user.created"), response, 201);
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.verify(req.body, req.language);
      res.sendSuccess(req.t("user.verified"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.resendOtp(req.body, req.language);
      res.sendSuccess(req.t("user.resentOtp"), response, 200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.login(req.body);
      if ("token" in response) {
        res.sendSuccess(req.t("user.login_verified"), response, 200);
      } else {
        res.sendSuccess(req.t("user.login_unverified"), response, 200);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.updatePassword(
        req.body,
        req.user.id,
        req.language
      );
      res.sendSuccess(req.t("user.password_updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const response = await this.userService.requestPasswordReset(
        email,
        req.language
      );
      res.sendSuccess(req.t("user.password_reset_request"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async verifyResetPasswordOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.userService.verifyResetPasswordOtp(
        req.body,
        req.language
      );
      res.sendSuccess(req.t("user.otp_verified"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.resetPassword(
        req.body,
        req.language
      );
      res.sendSuccess(req.t("user.password_updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async beProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.beProvider(
        req.user.id,
        req.language
      );
      res.sendSuccess(req.t("user.be_provider"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUserData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.updateUserData(
        req.user.id,
        req.body,
        req.language
      );
      res.sendSuccess(req.t("user.user_data_updated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.deleteUser(req.user.id);
      res.sendSuccess(req.t("user.user_deleted"), response, 200);
    } catch (error) {
      next(error);
    }
  }
}
