import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async getTokenForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.notificationService.getToken(
        req.user.id,
        "customer"
      );
      res.sendSuccess(req.t("notifications.token_generated"), response, 200);
    } catch (error) {
      next(error);
    }
  }

  async getTokenForProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.notificationService.getToken(
        req.user.id,
        "provider"
      );
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
