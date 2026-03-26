import { NotificationService } from "./notification.service";
import { NotificationRouter } from "./notification.router";

export class NotificationModule {
  notificationService: NotificationService;
  private notificationRouter: NotificationRouter;

  constructor() {
    this.notificationService = new NotificationService();
    this.notificationRouter = new NotificationRouter(this.notificationService);
  }

  routerFactory() {
    return this.notificationRouter.createRouter();
  }
}
