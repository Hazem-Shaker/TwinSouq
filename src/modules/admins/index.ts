import { AdminService } from "./admin.service";
import { AdminRouter } from "./admin.router";
import { AdminAuthMiddleware } from "../../shared/middlewares/auth";

export class AdminModule {
  adminService: AdminService;
  adminRouter: AdminRouter;
  adminAuthMiddleware: AdminAuthMiddleware;

  constructor(adminAuthMiddleware: AdminAuthMiddleware) {
    this.adminAuthMiddleware = adminAuthMiddleware;
    this.adminService = new AdminService();
    this.adminRouter = new AdminRouter(
      this.adminService,
      this.adminAuthMiddleware
    );
  }

  routerFactory() {
    return this.adminRouter.createRouter();
  }
}
