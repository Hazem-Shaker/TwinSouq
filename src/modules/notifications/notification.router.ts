import { Router } from "express";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import {
  ProviderAuthMiddleware,
  UserAuthMiddleware,
} from "../../shared/middlewares/auth";

export class NotificationRouter {
  private notificationController: NotificationController;
  private userAuthMiddleware: UserAuthMiddleware;
  private providerAuthMiddleware: ProviderAuthMiddleware;
  constructor(private notificationService: NotificationService) {
    this.notificationController = new NotificationController(
      this.notificationService
    );

    this.userAuthMiddleware = new UserAuthMiddleware();
    this.providerAuthMiddleware = new ProviderAuthMiddleware();
  }

  createRouter() {
    const router = Router();

    router.get(
      "/user/token",
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.notificationController.getTokenForUser.bind(
        this.notificationController
      )
    );

    router.get(
      "/provider/token",
      this.providerAuthMiddleware.authenticate.bind(
        this.providerAuthMiddleware
      ),
      this.notificationController.getTokenForProvider.bind(
        this.notificationController
      )
    );

    return router;
  }
}
